/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */
import isObject from "is-object";
import { DatabaseFilter, DatabaseFilterOperatorParams, Where } from "ts-arch-kit/dist/database";

import { DbFilterOptions, FilterOperators } from "../../helpers";

type SqlFragment = {
    sql: string;
    params: any[];
};

export class SqlWhereBuilder {
    private clauses: string[] = [];
    private params: unknown[] = [];

    add(sql: string, params: unknown[] = []) {
        this.clauses.push(sql);
        this.params.push(...params);
    }

    build(): SqlFragment {
        if (!this.clauses.length) {
            return { sql: "", params: [] };
        }

        return {
            sql: this.clauses.length ? this.normalizeParams(`WHERE ${this.clauses.join(" AND ")}`) : "",
            params: this.params,
        };
    }

    private normalizeParams(sql: string) {
        let i = 0;
        // eslint-disable-next-line no-plusplus
        return sql.replace(/\?/g, () => `$${++i}`);
    }
}

export class PgWhereFilter extends DatabaseFilter<void> {
    private where: SqlWhereBuilder;

    constructor() {
        super();
        this.where = new SqlWhereBuilder();
    }

    filter(filterOptions: DbFilterOptions, filter?: Where): SqlWhereBuilder | null {
        if (!filter || !Object.keys(filter).length) return null;
        const { columns } = filterOptions;
        Object.entries<unknown | FilterOperators<unknown>>(filter).forEach(([field, value]) => {
            const { columnName } = columns[field];
            if (!isObject(value)) this.exact({ columnName, value });
            else {
                const advancedFilter = value as FilterOperators<unknown>;
                if (advancedFilter.$exact) this.exact({ columnName, value: advancedFilter.$exact });
                if (advancedFilter.$iexact) this.iexact({ columnName, value: advancedFilter.$iexact });
                if (advancedFilter.$exclude) this.exclude({ columnName, value: advancedFilter.$exclude });
                if (advancedFilter.$like) this.like({ columnName, value: advancedFilter.$like });
                if (advancedFilter.$ilike) this.ilike({ columnName, value: advancedFilter.$ilike });
                if (advancedFilter.$startWith) this.startWith({ columnName, value: advancedFilter.$startWith });
                if (advancedFilter.$endWith) this.endWith({ columnName, value: advancedFilter.$endWith });
                if (advancedFilter.$lt) this.lt({ columnName, value: advancedFilter.$lt });
                if (advancedFilter.$lte) this.lte({ columnName, value: advancedFilter.$lte });
                if (advancedFilter.$gt) this.gt({ columnName, value: advancedFilter.$gt });
                if (advancedFilter.$gte) this.gte({ columnName, value: advancedFilter.$gte });
                if (advancedFilter.$range) this.range({ columnName, value: advancedFilter.$range });
                if (advancedFilter.$in) this.in({ columnName, value: advancedFilter.$in });
                if (advancedFilter.$notIn) this.notIn({ columnName, value: advancedFilter.$notIn });
                if (advancedFilter.$isNull) this.isNull({ columnName, value: advancedFilter.$isNull });
            }
        });
        return this.where;
    }

    private add(sql: string, ...params: any[]) {
        this.where.add(sql, params);
    }

    exact({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} = ?`, value);
    }

    iexact({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`LOWER(${columnName}) = LOWER(?)`, value);
    }

    exclude({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} <> ?`, value);
    }

    like({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} LIKE ?`, `%${value}%`);
    }

    ilike({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} ILIKE ?`, `%${value}%`);
    }

    startWith({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} ILIKE ?`, `${value}%`);
    }

    endWith({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} ILIKE ?`, `%${value}`);
    }

    lt({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} < ?`, value);
    }

    lte({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} <= ?`, value);
    }

    gt({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} > ?`, value);
    }

    gte({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} >= ?`, value);
    }

    range({ columnName, value }: DatabaseFilterOperatorParams): void {
        const { start, end } = value as { start: number | Date; end: number | Date };
        this.add(`${columnName} BETWEEN ? AND ?`, start, end);
    }

    in({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} = ANY(?)`, ...(value as any[]));
    }

    notIn({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`NOT (${columnName} = ANY(?))`, ...(value as any[]));
    }

    isNull({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(value ? `${columnName} IS NULL` : `${columnName} IS NOT NULL`);
    }

    // https://chatgpt.com/c/69531a82-c498-832f-ae23-60e0f15188bb
    jsonExact({ columnName, value }: DatabaseFilterOperatorParams) {
        // this.stmt.whereRaw(`${columnName} @> ?::jsonb`, [JSON.stringify(value)]);
        // this.stmt.where;
    }

    jsonExists({ columnName, key }: { columnName: string; key: string }) {
        // this.stmt.whereRaw(`${columnName} ? ?`, [key]);
    }

    jsonHasAll({ columnName, keys }: { columnName: string; keys: string[] }) {
        // this.stmt.whereRaw(`${columnName} ?& ?`, [keys]);
    }

    jsonHasAny({ columnName, keys }: { columnName: string; keys: string[] }) {
        // this.stmt.whereRaw(`${columnName} ?| ?`, [keys]);
    }

    jsonIn({ columnName, values }: { columnName: string; values: Record<string, unknown>[] }) {
        // this.stmt.((qb) => {
        //     values.forEach((val, index) => {
        //         if (index === 0) {
        //             qb.whereRaw(`${columnName} @> ?::jsonb`, [JSON.stringify(val)]);
        //         } else {
        //             qb.orWhereRaw(`${columnName} @> ?::jsonb`, [JSON.stringify(val)]);
        //         }
        //     });
        // });
    }
}
