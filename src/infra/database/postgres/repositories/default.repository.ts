import { PoolClient } from "pg";
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
        const fragments = [`SELECT count(id) FROM ${this.tableName}`];
        fragments.push(this.filter(this.mapper.filterOptions, filter));
        const query = this.prepareStmt(fragments);
        const trx = this.getTransaction();
        const {
            rows: [row],
        } = await trx.query(query);
        return parseNumber(row.count);
    }

    async exists(where?: Where): Promise<boolean> {
        const count = await this.count(where);
        return count > 0;
    }

    async find(queryOptions?: QueryOptions): Promise<T[]> {
        const { filter, pagination, sort } = queryOptions || {};
        const fragments = [`SELECT * FROM ${this.tableName}`];
        fragments.push(
            this.filter(this.mapper.filterOptions, filter),
            this.sort(this.mapper.filterOptions.columns, sort),
            this.pagination(pagination)
        );
        const query = this.prepareStmt(fragments);
        const trx = this.getTransaction();
        const { rows } = await trx.query(query);
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
        const trx = this.getTransaction();
        const persistenceData = this.mapper.toPersistence(data);
        let exists = true;
        if (data.id !== 0) exists = await this.exists({ id: data.id });
        if (!exists) {
            const insertObj = this.removeFieldsFromObject(persistenceData);
            const fields = Object.keys(insertObj);
            const values = Object.values(insertObj);
            const query = `INSERT INTO ${this.tableName} (${fields.join(",")}) VALUES (${values.map(
                (v, i) => `$${i + 1}`
            )}) RETURNING *;`;
            const {
                rows: [newEntity],
            } = await trx.query(query, values);
            return this.mapper.toDomain(newEntity);
        }
        const updateObj = this.removeFieldsFromObject(persistenceData, ["id"]);
        const fields = Object.keys(updateObj);
        const values = Object.values(updateObj);
        const strFields = fields.map((f, i) => `${f} = $${i + 1}`).join(",");
        const query = `UPDATE ${this.tableName} SET ${strFields} WHERE id = $${fields.length + 1} RETURNING *;`;
        const {
            rows: [updatedEntity],
        } = await trx.query(query, [...values, data.id]);
        return this.mapper.toDomain(updatedEntity);
    }

    async destroy(model: T): Promise<void> {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1;`;
        const trx = this.getTransaction();
        await trx.query(query, [model.id]);
    }

    getTransaction(): PoolClient {
        if (!this.uow)
            throw new DbTransactionNotPreparedError(`O UnitOfWork não foi inicializado para a tabela "${this.tableName}".`);
        return this.uow.getTransaction();
    }

    filter(filterOptions: DbFilterOptions, filter?: Where): string {
        const pgWhereFilter = new PgWhereFilter(filterOptions);
        const whereClauses = pgWhereFilter.filter(filterOptions, filter);
        return whereClauses.length ? `WHERE ${whereClauses}` : "";
    }

    sort(columns: DbColumns, sortParams?: SortParams[]): string {
        if (!sortParams) return "";
        const orders: string[] = [];
        sortParams.forEach((sort) => {
            const { column, order, nulls } = sort;
            const { columnName } = columns[column];
            const clause: string[] = [];
            clause.push(columnName, order.toUpperCase());
            if (nulls) clause.push(nulls.toUpperCase());
            orders.push(clause.join(" "));
        });
        return `ORDER BY ${orders.filter(Boolean).join(",")}`;
    }

    pagination(paginationParams?: PaginationParams): string {
        if (!paginationParams) return "";
        return `LIMIT ${paginationParams.limit} OFFSET ${paginationParams.skip}`;
    }

    prepareStmt(fragments: string[]): string {
        return fragments.filter(Boolean).join(" ");
    }

    removeFieldsFromObject(obj: Record<string, unknown>, ignore: string[] = []): Record<string, unknown> {
        const modifiedObj: Record<string, unknown> = {};
        Object.entries(obj).forEach(([k, v]) => {
            if (v !== undefined && !ignore?.includes(k)) modifiedObj[k] = v;
        });
        return modifiedObj;
    }
}
