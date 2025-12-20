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

import { select, insert, update, remove } from "@rusdidev/pg-query-builder";

import { DbFilterOptions, DbColumns, IRepository, SelectQueryBuilder } from "../../helpers";
import { IDbMapper } from "../db-mapper";
import { PgWhereFilter } from "./pg-where";

export class DefaultPgRepository<T extends AbstractModelProps, P = Record<string, unknown>> implements IRepository<T> {
    protected uow?: UnitOfWork<PoolClient>;

    constructor(readonly tableName: string, readonly mapper: IDbMapper<T, P>) {}

    setUnitOfWork(uow: UnitOfWork<PoolClient>): void {
        this.uow = uow;
    }

    async count(filter?: Where): Promise<number> {
        const stmt = select({ table: this.tableName }).addSelectItems("count(id)");
        this.filter(stmt, this.mapper.filterOptions, filter);
        const [query, values] = stmt.compile();
        const {
            rows: [row],
        } = await this.query(query, values);
        return parseNumber(row.count);
    }

    async exists(where?: Where): Promise<boolean> {
        const count = await this.count(where);
        return count > 0;
    }

    async find(queryOptions?: QueryOptions): Promise<T[]> {
        const { filter, pagination, sort } = queryOptions || {};
        const stmt = select({ table: this.tableName }).addSelectItems("*");
        this.filter(stmt, this.mapper.filterOptions, filter);
        this.sort(stmt, this.mapper.filterOptions.columns, sort);
        this.pagination(stmt, pagination);
        const [query, values] = stmt.compile();
        const { rows } = await this.query(query, values);
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
            const stmt = insert({ table: this.tableName })
                .addColumnItem(...fields)
                .addInsertPayload(insertObj as any)
                .addReturnItems("*");
            const [query, values] = stmt.compile();
            const {
                rows: [newEntity],
            } = await this.query(query, values);
            return this.mapper.toDomain(newEntity);
        }
        const updateObj = this.removeFieldsFromObject(persistenceData, ["id"]);
        const stmt = update({ table: this.tableName })
            .addSetClauseItems(updateObj as any)
            .addWhereClauseItem({ column: "id", operator: "eq", value: data.id })
            .addReturnItems("*");
        const [query, values] = stmt.compile();
        const {
            rows: [updatedEntity],
        } = await this.query(query, values);
        return this.mapper.toDomain(updatedEntity);
    }

    async destroy(model: T): Promise<void> {
        const stmt = remove({ table: this.tableName }).addWhereClauseItem({ column: "id", operator: "eq", value: model.id });
        const [query, values] = stmt.compile();
        await this.query(query, values);
    }

    filter(stmt: SelectQueryBuilder, filterOptions: DbFilterOptions, filter?: Where) {
        const pgWhereFilter = new PgWhereFilter(stmt, this.mapper.filterOptions);
        pgWhereFilter.filter(filterOptions, filter);
    }

    sort(stmt: SelectQueryBuilder, columns: DbColumns, sortParams?: SortParams[]) {
        if (!sortParams) return;
        sortParams.forEach((sort) => {
            const { column, order: direction } = sort;
            const { columnName } = columns[column];
            const order = direction === "asc" ? "ASC" : "DESC";
            stmt.addOrderByItem({ column: columnName, order });
        });
    }

    pagination(stmt: SelectQueryBuilder, paginationParams?: PaginationParams) {
        if (!paginationParams) return;
        stmt.useLimit(paginationParams.limit, paginationParams.skip);
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
