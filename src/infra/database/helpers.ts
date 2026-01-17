/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbstractModelProps } from "ts-arch-kit/dist/core/models";
import {
    ISetUnitOfWork,
    IRepository as IBaseRepository,
    FilterOperators as BaseFilterOperators,
} from "ts-arch-kit/dist/database";

import { Entity } from "@/app/_common";

export interface IRepository<T extends AbstractModelProps, W = Record<string, unknown>>
    extends ISetUnitOfWork,
        IBaseRepository<T, W> {}

export type FilterOperators<T> = BaseFilterOperators<T> & {
    $jsonExact?: Record<string, unknown>;
    $jsonExists?: string[];
    $jsonHasAll?: string[];
    $jsonHasAny?: string[];
    $jsonIn?: Record<string, unknown>[];
};

export type DbFilterableColumn = {
    columnName: string;
    toPersistence?: (value: any) => any;
    toDomain?: (value: any) => any;
    blockFilter?: boolean;
    allowedFilters?: (keyof FilterOperators<unknown>)[];
    noPersist?: boolean;
};

type DomainKeys<T> = T extends Entity<infer P> ? keyof P : T extends Record<string, unknown> ? keyof T : any;

export type ColumnMap<TDomain> = {
    [K in DomainKeys<TDomain>]: DbFilterableColumn;
} & { [key: string]: DbFilterableColumn };

export type DbFilterOptions<TDomain> = {
    searchFields?: string[];
    customFilters?: Record<string, string[]>;
    columns: ColumnMap<TDomain>;
};
