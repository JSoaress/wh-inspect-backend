/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-syntax */
import { IToDomain, IToPersistence } from "ts-arch-kit/dist/database";

import { Entity } from "@/app/_common";

import { DbFilterableColumn, DbFilterOptions } from "../helpers";

export interface IDbMapper<T, P> extends IToDomain<T, P>, IToPersistence<T, Partial<P>> {
    readonly filterOptions: DbFilterOptions<T>;
}

export abstract class DbMapper<TEntity, TPersistence> implements IDbMapper<TEntity, TPersistence> {
    abstract readonly filterOptions: DbFilterOptions<TEntity>;

    constructor(protected domainRestore: (props: any) => TEntity) {}

    toDomain(dto: TPersistence): TEntity {
        const props: Record<string, unknown> = {};
        for (const [prop, config] of Object.entries<DbFilterableColumn>(this.filterOptions.columns)) {
            if (config.noPersist) continue;
            const value = dto[config.columnName as keyof TPersistence];
            props[prop] = config.toDomain ? config.toDomain(dto) : value;
        }
        return this.domainRestore(props);
    }

    toPersistence(entity: TEntity): Partial<TPersistence> {
        const result: Partial<TPersistence> = {};
        if (entity instanceof Entity) {
            for (const [prop, config] of Object.entries<DbFilterableColumn>(this.filterOptions.columns)) {
                const key = prop as keyof TEntity;
                if (config.noPersist || (!entity.isNew && !entity.checkDirtyProps(key))) continue;
                const value = prop === "id" ? entity.getId() : entity.get(key);
                if (value === undefined) continue;
                result[config.columnName as keyof TPersistence] = config.toPersistence
                    ? config.toPersistence(entity)
                    : value;
            }
        } else {
            for (const [prop, config] of Object.entries<DbFilterableColumn>(this.filterOptions.columns)) {
                if (config.noPersist) continue;
                const key = prop as keyof TEntity;
                const value = entity[key];
                if (value === undefined) continue;
                result[config.columnName as keyof TPersistence] = config.toPersistence
                    ? config.toPersistence(entity)
                    : value;
            }
        }
        return result;
    }
}
