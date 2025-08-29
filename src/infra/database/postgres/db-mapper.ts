import { IToDomain, IToPersistence } from "ts-arch-kit/dist/database";

import { DbFilterOptions } from "../helpers";

export interface IDbMapper<T, P> extends IToDomain<T, P>, IToPersistence<T, Partial<P>> {
    readonly filterOptions: DbFilterOptions;
}
