import { CacheIncrementOptions, CacheSetOptions, ICacheProvider } from "./cache";

type CacheEntry = {
    value: unknown;
    expiresAt?: number;
};

export class MemoryCache implements ICacheProvider {
    private store = new Map<string, CacheEntry>();

    private isExpired(entry: CacheEntry) {
        return entry.expiresAt !== undefined && entry.expiresAt < Date.now();
    }

    async get<T = unknown>(key: string): Promise<T | null> {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (this.isExpired(entry)) {
            this.store.delete(key);
            return null;
        }
        return entry.value as T;
    }

    async set<T = unknown>(key: string, value: T, options?: CacheSetOptions): Promise<void> {
        const expiresAt = options?.ttl ? Date.now() + options.ttl * 1000 : undefined;
        this.store.set(key, { value, expiresAt });
    }

    async increment(key: string, options?: CacheIncrementOptions): Promise<number> {
        const { by = 1, ttl } = options || {};
        const current = await this.get<number>(key);
        const value = typeof current === "number" ? current + by : by;
        const expiresAt = current === null && ttl ? Date.now() + ttl * 1000 : this.store.get(key)?.expiresAt;
        this.store.set(key, { value, expiresAt });
        return value;
    }

    async decrement(key: string, options?: CacheIncrementOptions): Promise<number> {
        const { by = 1 } = options || {};
        return this.increment(key, { ...options, by: -by });
    }

    async delete(key: string): Promise<void> {
        this.store.delete(key);
    }

    async exists(key: string): Promise<boolean> {
        return (await this.get(key)) !== null;
    }

    async clear(): Promise<void> {
        this.store.clear();
    }
}
