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
    static readonly PLACEHOLDER = "__PARAM__";

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
        return sql.replace(/__PARAM__/g, () => `$${++i}`);
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
                if (advancedFilter.$jsonExact) this.jsonExact({ columnName, value: advancedFilter.$jsonExact });
                if (advancedFilter.$jsonExists) this.jsonExists({ columnName, value: advancedFilter.$jsonExists });
                if (advancedFilter.$jsonHasAll) this.jsonHasAll({ columnName, value: advancedFilter.$jsonHasAll });
                if (advancedFilter.$jsonHasAny) this.jsonHasAny({ columnName, value: advancedFilter.$jsonHasAny });
                if (advancedFilter.$jsonIn) this.jsonIn({ columnName, value: advancedFilter.$jsonIn });
            }
        });
        return this.where;
    }

    private add(sql: string, ...params: any[]) {
        this.where.add(sql, params);
    }

    exact({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} = ${SqlWhereBuilder.PLACEHOLDER}`, value);
    }

    iexact({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`LOWER(${columnName}) = LOWER(${SqlWhereBuilder.PLACEHOLDER})`, value);
    }

    exclude({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} <> ${SqlWhereBuilder.PLACEHOLDER}`, value);
    }

    like({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} LIKE ${SqlWhereBuilder.PLACEHOLDER}`, `%${value}%`);
    }

    ilike({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} ILIKE ${SqlWhereBuilder.PLACEHOLDER}`, `%${value}%`);
    }

    startWith({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} ILIKE ${SqlWhereBuilder.PLACEHOLDER}`, `${value}%`);
    }

    endWith({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} ILIKE ${SqlWhereBuilder.PLACEHOLDER}`, `%${value}`);
    }

    lt({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} < ${SqlWhereBuilder.PLACEHOLDER}`, value);
    }

    lte({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} <= ${SqlWhereBuilder.PLACEHOLDER}`, value);
    }

    gt({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} > ${SqlWhereBuilder.PLACEHOLDER}`, value);
    }

    gte({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(`${columnName} >= ${SqlWhereBuilder.PLACEHOLDER}`, value);
    }

    range({ columnName, value }: DatabaseFilterOperatorParams): void {
        const { start, end } = value as { start: number | Date; end: number | Date };
        this.add(`${columnName} BETWEEN ${SqlWhereBuilder.PLACEHOLDER} AND ${SqlWhereBuilder.PLACEHOLDER}`, start, end);
    }

    in({ columnName, value }: DatabaseFilterOperatorParams): void {
        const values = value as any[];
        this.add(`${columnName} IN (${values.map(() => SqlWhereBuilder.PLACEHOLDER)})`, ...values);
    }

    notIn({ columnName, value }: DatabaseFilterOperatorParams): void {
        const values = value as any[];
        this.add(`NOT (${columnName} IN (${values.map(() => SqlWhereBuilder.PLACEHOLDER)}))`, ...values);
    }

    isNull({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.add(value ? `${columnName} IS NULL` : `${columnName} IS NOT NULL`);
    }

    jsonExact({ columnName, value }: DatabaseFilterOperatorParams) {
        this.add(`${columnName} @> ${SqlWhereBuilder.PLACEHOLDER}::jsonb`, JSON.stringify(value));
    }

    jsonExists({ columnName, value }: DatabaseFilterOperatorParams) {
        const keys = value as string[];
        if (!keys.length) return;
        if (keys.length === 1) this.add(`${columnName} ? ${SqlWhereBuilder.PLACEHOLDER}`, ...keys);
        else {
            const first = keys.slice(0, keys.length - 1);
            const sql = `${columnName} ${first.map(() => `-> ${SqlWhereBuilder.PLACEHOLDER}`).join(" ")} ? ${
                SqlWhereBuilder.PLACEHOLDER
            }`;
            this.add(sql, ...keys);
        }
    }

    jsonHasAll({ columnName, value }: DatabaseFilterOperatorParams) {
        this.add(`${columnName} ?& ${SqlWhereBuilder.PLACEHOLDER}`, `ARRAY[${(value as string[]).map((v) => `'${v}'`)}]`);
    }

    jsonHasAny({ columnName, value }: DatabaseFilterOperatorParams) {
        this.add(`${columnName} ?| ${SqlWhereBuilder.PLACEHOLDER}`, `ARRAY[${(value as string[]).map((v) => `'${v}'`)}]`);
    }

    jsonIn({ columnName, value }: DatabaseFilterOperatorParams) {
        const values = (value as Record<string, unknown>[]).map((v) => JSON.stringify(v));
        this.add(`${columnName} @> ANY (${SqlWhereBuilder.PLACEHOLDER}::jsonb[])`, `ARRAY[${values.map((v) => `'${v}'`)}]`);
    }
}
