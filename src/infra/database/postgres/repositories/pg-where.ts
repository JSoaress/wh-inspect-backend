import isObject from "is-object";
import { DatabaseFilter, DatabaseFilterOperatorParams, FilterOperators, Where } from "ts-arch-kit/dist/database";

import { DbColumnType, DbFilterOptions } from "../../helpers";

export class PgWhereFilter extends DatabaseFilter<string> {
    constructor(readonly filterOptions: DbFilterOptions) {
        super();
    }

    filter(filterOptions: DbFilterOptions, filter?: Where): string {
        if (!filter) return "";
        const { columns } = filterOptions;
        const conditions: string[] = [];
        Object.entries<unknown | FilterOperators<unknown>>(filter).forEach(([field, value]) => {
            const { columnName, type } = columns[field];
            if (!isObject(value)) {
                conditions.push(this.exact({ columnName, value: this.quotesInValue(type, value) }));
            }
            const advancedFilter = value as FilterOperators<unknown>;
            if (advancedFilter.$exact)
                conditions.push(this.exact({ columnName, value: this.quotesInValue(type, advancedFilter.$exact) }));
            if (advancedFilter.$iexact)
                conditions.push(this.iexact({ columnName, value: this.quotesInValue(type, advancedFilter.$iexact) }));
            if (advancedFilter.$exclude)
                conditions.push(this.exclude({ columnName, value: this.quotesInValue(type, advancedFilter.$exclude) }));
            if (advancedFilter.$like)
                conditions.push(this.like({ columnName, value: this.quotesInValue(type, advancedFilter.$like) }));
            if (advancedFilter.$ilike)
                conditions.push(this.ilike({ columnName, value: this.quotesInValue(type, advancedFilter.$ilike) }));
            if (advancedFilter.$startWith)
                conditions.push(this.startWith({ columnName, value: this.quotesInValue(type, advancedFilter.$startWith) }));
            if (advancedFilter.$endWith)
                conditions.push(this.endWith({ columnName, value: this.quotesInValue(type, advancedFilter.$endWith) }));
            if (advancedFilter.$lt)
                conditions.push(this.lt({ columnName, value: this.quotesInValue(type, advancedFilter.$lt) }));
            if (advancedFilter.$lte)
                conditions.push(this.lte({ columnName, value: this.quotesInValue(type, advancedFilter.$lte) }));
            if (advancedFilter.$gt)
                conditions.push(this.gt({ columnName, value: this.quotesInValue(type, advancedFilter.$gt) }));
            if (advancedFilter.$gte)
                conditions.push(this.gte({ columnName, value: this.quotesInValue(type, advancedFilter.$gte) }));
            if (advancedFilter.$range)
                conditions.push(this.range({ columnName, value: this.quotesInValue(type, advancedFilter.$range) }));
            if (advancedFilter.$in)
                conditions.push(this.in({ columnName, value: this.quotesInValue(type, advancedFilter.$in) }));
            if (advancedFilter.$notIn)
                conditions.push(this.notIn({ columnName, value: this.quotesInValue(type, advancedFilter.$notIn) }));
            if (advancedFilter.$isNull)
                conditions.push(this.isNull({ columnName, value: this.quotesInValue(type, advancedFilter.$isNull) }));
        });
        return conditions.filter(Boolean).join(" AND ");
    }

    private quotesInValue(type: DbColumnType, value: unknown) {
        if (type === "string") return `'${value}'`;
        // if (type === "date") return `'${dateHandler.format(value as string, "yyyy-MM-dd")}'`;
        // if (type === "hour") return `'${dateHandler.format(value as string, "HH:mm:ss")}'`;
        if (value && type === "number" && /[A-Za-z]/.test(String(value))) return "";
        return value;
    }

    exact({ columnName, value, unaccent }: DatabaseFilterOperatorParams): string {
        if (unaccent) return `unaccent(${columnName}) = unaccent(${value})`;
        return `${columnName} = ${value}`;
    }

    iexact({ columnName, value, unaccent }: DatabaseFilterOperatorParams): string {
        if (unaccent) return `LOWER(unaccent(${columnName})) = LOWER(unaccent(${value}))`;
        return `LOWER(${columnName}) = LOWER(${value})`;
    }

    exclude({ columnName, value, unaccent }: DatabaseFilterOperatorParams): string {
        if (unaccent) return `unaccent(${columnName}) <> unaccent(${value})`;
        return `${columnName} <> ${value}`;
    }

    like({ columnName, value, unaccent }: DatabaseFilterOperatorParams): string {
        const formattedValue = typeof value === "string" ? value.replaceAll("'", "") : value;
        if (unaccent) return `unaccent(${columnName}) LIKE unaccent('%${formattedValue}%')`;
        return `${columnName} LIKE '%${formattedValue}%'`;
    }

    ilike({ columnName, value, unaccent }: DatabaseFilterOperatorParams): string {
        const formattedValue = typeof value === "string" ? value.replaceAll("'", "") : value;
        if (unaccent) return `unaccent(${columnName}) ILIKE unaccent('%${formattedValue}%')`;
        return `${columnName} ILIKE '%${formattedValue}%'`;
    }

    startWith({ columnName, value, unaccent }: DatabaseFilterOperatorParams): string {
        const formattedValue = typeof value === "string" ? value.replaceAll("'", "") : value;
        if (unaccent) return `unaccent(${columnName}) ILIKE unaccent('${formattedValue}%')`;
        return `${columnName} ILIKE '${formattedValue}%'`;
    }

    endWith({ columnName, value, unaccent }: DatabaseFilterOperatorParams): string {
        const formattedValue = typeof value === "string" ? value.replaceAll("'", "") : value;
        if (unaccent) return `unaccent(${columnName}) ILIKE unaccent('%${formattedValue}')`;
        return `${columnName} ILIKE '%${formattedValue}'`;
    }

    lt({ columnName, value }: DatabaseFilterOperatorParams): string {
        return `${columnName} < ${value}`;
    }

    lte({ columnName, value }: DatabaseFilterOperatorParams): string {
        return `${columnName} <= ${value}`;
    }

    gt({ columnName, value }: DatabaseFilterOperatorParams): string {
        return `${columnName} > ${value}`;
    }

    gte({ columnName, value }: DatabaseFilterOperatorParams): string {
        return `${columnName} >= ${value}`;
    }

    range({ columnName, value }: DatabaseFilterOperatorParams): string {
        const [start, end] = value as unknown[];
        return `${columnName} BETWEEN ${start} AND ${end}`;
    }

    in({ columnName, value }: DatabaseFilterOperatorParams): string {
        return `${columnName} IN (${value})`;
    }

    notIn({ columnName, value }: DatabaseFilterOperatorParams): string {
        return `${columnName} NOT IN (${value})`;
    }

    isNull({ columnName, value }: DatabaseFilterOperatorParams): string {
        return `${columnName} ${value ? "IS NULL" : "IS NOT NULL"}`;
    }
}
