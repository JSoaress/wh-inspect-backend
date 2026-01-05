export type CacheSetOptions = {
    ttl?: number;
};

export type CacheIncrementOptions = Pick<CacheSetOptions, "ttl"> & { by?: number };

export interface ICacheProvider {
    get<T = unknown>(key: string): Promise<T | null>;
    set<T = unknown>(key: string, value: T, options?: CacheSetOptions): Promise<void>;
    increment(key: string, options?: CacheIncrementOptions): Promise<number>;
    decrement(key: string, options?: CacheIncrementOptions): Promise<number>;
    delete(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    clear(): Promise<void>;
}
