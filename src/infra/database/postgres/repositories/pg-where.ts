import isObject from "is-object";
import { DatabaseFilter, DatabaseFilterOperatorParams, FilterOperators, Where } from "ts-arch-kit/dist/database";

import { DbFilterOptions, SelectQueryBuilder } from "../../helpers";

export class PgWhereFilter extends DatabaseFilter<void> {
    constructor(private stmt: SelectQueryBuilder, readonly filterOptions: DbFilterOptions) {
        super();
    }

    filter(filterOptions: DbFilterOptions, filter?: Where): void {
        if (!filter) return;
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
    }

    exact({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.stmt.addWhereClauseItem({ column: columnName, operator: "eq", value });
    }

    iexact({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.stmt.addWhereClauseItem({ column: columnName, operator: "ilike", value });
    }

    exclude({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.stmt.addWhereClauseItem({ column: columnName, operator: "ne", value });
    }

    like({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.stmt.addWhereClauseItem({ column: columnName, operator: "like", value: `%${value}%` });
    }

    ilike({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.stmt.addWhereClauseItem({ column: columnName, operator: "ilike", value: `%${value}%` });
    }

    startWith({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.stmt.addWhereClauseItem({ column: columnName, operator: "ilike", value: `${value}%` });
    }

    endWith({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.stmt.addWhereClauseItem({ column: columnName, operator: "ilike", value: `%${value}` });
    }

    lt({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.stmt.addWhereClauseItem({ column: columnName, operator: "lt", value });
    }

    lte({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.stmt.addWhereClauseItem({ column: columnName, operator: "le", value });
    }

    gt({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.stmt.addWhereClauseItem({ column: columnName, operator: "gt", value });
    }

    gte({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.stmt.addWhereClauseItem({ column: columnName, operator: "ge", value });
    }

    range({ columnName, value }: DatabaseFilterOperatorParams): void {
        const { start, end } = value as { start: number | Date; end: number | Date };
        this.stmt
            .addWhereClauseItem({ column: columnName, operator: "ge", value: start })
            .addWhereClauseItem({ column: columnName, operator: "le", value: end });
    }

    in({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.stmt.addWhereClauseItem({ column: columnName, operator: "isIn", value });
    }

    notIn({ columnName, value }: DatabaseFilterOperatorParams): void {
        this.stmt.addWhereClauseItem({ column: columnName, operator: "notIn", value });
    }

    isNull({ columnName, value }: DatabaseFilterOperatorParams): void {
        if (value) this.stmt.addWhereClauseItem({ column: columnName, operator: "empty", value: undefined });
        else this.stmt.addWhereClauseItem({ column: columnName, operator: "notEmpty", value: undefined });
    }
}
