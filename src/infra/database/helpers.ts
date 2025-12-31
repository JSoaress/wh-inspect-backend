import { AbstractModelProps } from "ts-arch-kit/dist/core/models";
import {
    ISetUnitOfWork,
    IRepository as IBaseRepository,
    FilterOperators as BaseFilterOperators,
} from "ts-arch-kit/dist/database";

export interface IRepository<T extends AbstractModelProps, W = Record<string, unknown>>
    extends ISetUnitOfWork,
        IBaseRepository<T, W> {}

export type DbColumnType = "string" | "number" | "boolean" | "date" | "hour" | "json";

export type FilterOperators<T> = BaseFilterOperators<T> & {
    $jsonExists: T;
    $jsonHasAll: T;
    $jsonHasAny: T;
    $jsonIn: T;
};

export type DbFilterableColumn = {
    columnName: string;
    type: DbColumnType;
    blockFilter?: boolean;
    allowedFilters?: (keyof FilterOperators<unknown>)[];
};

export type DbColumns = Record<string, DbFilterableColumn>;

export type DbFilterOptions = {
    searchFields?: string[];
    customFilters?: Record<string, string[]>;
    columns: DbColumns;
};
