/* eslint-disable @typescript-eslint/no-explicit-any */
import { PoolClient, QueryConfigValues, QueryResult, QueryResultRow } from "pg";
import { parseNumber } from "ts-arch-kit/dist/core/helpers";
import { AbstractModelProps, PrimaryKey } from "ts-arch-kit/dist/core/models";
import {
    UnitOfWork,
    Where,
    QueryOptions,
    QueryOptionsWithoutPagination,
    PaginationParams,
    SortParams,
    DbTransactionNotPreparedError,
} from "ts-arch-kit/dist/database";

import { DbFilterOptions, DbColumns, IRepository } from "../../helpers";
import { IDbMapper } from "../db-mapper";
import { PgWhereFilter } from "./pg-where";

export class DefaultPgRepository<T extends AbstractModelProps, P = Record<string, unknown>> implements IRepository<T> {
    protected uow?: UnitOfWork<PoolClient>;

    constructor(readonly tableName: string, readonly mapper: IDbMapper<T, P>) {}

    setUnitOfWork(uow: UnitOfWork<PoolClient>): void {
        this.uow = uow;
    }

    async count(filter?: Where): Promise<number> {
        const base = `SELECT count(id) as count FROM ${this.tableName}`;
        const [where, params] = this.filter(this.mapper.filterOptions, filter);
        const query = this.prepareStmt(base, where);
        const {
            rows: [row],
        } = await this.query(query, params);
        return parseNumber(row.count);
    }

    async exists(where?: Where): Promise<boolean> {
        const count = await this.count(where);
        return count > 0;
    }

    async find(queryOptions?: QueryOptions): Promise<T[]> {
        const { filter, pagination, sort } = queryOptions || {};
        const base = `SELECT * FROM ${this.tableName}`;
        const [where, params] = this.filter(this.mapper.filterOptions, filter);
        const orderBy = this.sort(this.mapper.filterOptions.columns, sort);
        const paginationQuery = this.pagination(pagination);
        const query = this.prepareStmt(base, where, orderBy, paginationQuery);
        const { rows } = await this.query(query, params);
        return rows.map((row) => this.mapper.toDomain(row));
    }

    async findOne(queryOptions?: QueryOptionsWithoutPagination): Promise<T | null> {
        const [one] = await this.find({ ...queryOptions, pagination: { limit: 1, skip: 0 } });
        return one || null;
    }

    async findById(id: PrimaryKey): Promise<T | null> {
        return this.findOne({ filter: { id } });
    }

    async save(data: T): Promise<T> {
        const persistenceData = this.mapper.toPersistence(data);
        let exists = false;
        if (data.id !== 0) exists = await this.exists({ id: data.id });
        if (!exists) {
            const ignore: string[] = data.id === 0 ? ["id"] : [];
            const insertObj = this.removeFieldsFromObject(persistenceData, ignore);
            const fields = Object.keys(insertObj);
            const values = Object.values(insertObj);
            const query = `INSERT INTO ${this.tableName} (${fields}) VALUES (${fields.map(
                (f, i) => `$${i + 1}`
            )}) RETURNING *`;
            const {
                rows: [newEntity],
            } = await this.query(query, values);
            return this.mapper.toDomain(newEntity);
        }
        const updateObj = this.removeFieldsFromObject(persistenceData, ["id"]);
        const fields = Object.keys(updateObj);
        const values = [...Object.values(updateObj), data.id];
        const set = fields.map((f, i) => `${f} = $${i + 1}`);
        const query = `UPDATE FROM ${this.tableName} SET ${set} WHERE id = $${values.length} RETURNING *`;
        const {
            rows: [updatedEntity],
        } = await this.query(query, values);
        return this.mapper.toDomain(updatedEntity);
    }

    async destroy(model: T): Promise<void> {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
        await this.query(query, [model.id]);
    }

    filter(filterOptions: DbFilterOptions, filter?: Where): [string, any[]] {
        const pgWhereFilter = new PgWhereFilter();
        const where = pgWhereFilter.filter(filterOptions, filter);
        if (!where) return ["", []];
        const { sql, params } = where.build();
        return [sql, params];
    }

    sort(columns: DbColumns, sortParams?: SortParams[]): string {
        if (!sortParams || !sortParams.length) return "";
        const order = sortParams.map((sort) => {
            const { column, order: direction } = sort;
            const { columnName } = columns[column];
            return `${columnName} ${direction.toUpperCase()}`;
        });
        return `ORDER BY ${order}`;
    }

    pagination(paginationParams?: PaginationParams): string {
        if (!paginationParams) return "";
        const { limit, skip } = paginationParams;
        return `LIMIT ${limit} OFFSET ${skip}`;
    }

    prepareStmt(...fragments: string[]): string {
        return fragments.filter(Boolean).join(" ");
    }

    removeFieldsFromObject(obj: Record<string, unknown>, ignore: string[] = []): Record<string, unknown> {
        const modifiedObj: Record<string, unknown> = {};
        Object.entries(obj).forEach(([k, v]) => {
            if (v !== undefined && !ignore?.includes(k)) modifiedObj[k] = v;
        });
        return modifiedObj;
    }

    async query<R extends QueryResultRow = any, I = any[]>(
        query: string,
        values?: QueryConfigValues<I>
    ): Promise<QueryResult<R>> {
        if (!this.uow)
            throw new DbTransactionNotPreparedError(`O UnitOfWork não foi inicializado para a tabela "${this.tableName}".`);
        const trx = this.uow.getTransaction();
        const result = await trx.query<R, I>(query, values);
        return result;
    }
}
