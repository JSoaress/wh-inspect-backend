import { AbstractModelProps } from "ts-arch-kit/dist/core/models";
import { ISetUnitOfWork, IRepository as IBaseRepository, FilterOperators } from "ts-arch-kit/dist/database";

export interface IRepository<T extends AbstractModelProps, W = Record<string, unknown>>
    extends ISetUnitOfWork,
        IBaseRepository<T, W> {}

export type DbColumnType = "string" | "number" | "boolean" | "date" | "hour";

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
