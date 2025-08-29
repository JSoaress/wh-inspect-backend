/* eslint-disable max-classes-per-file */
/* eslint-disable no-await-in-loop */
import { Pool, PoolClient } from "pg";
import { Left, Right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { DBConnectionTimeoutError, DbTransactionNotPreparedError } from "../../errors";

class PgConnection {
    readonly pool: Pool;
    // eslint-disable-next-line no-use-before-define
    private static instance: PgConnection | null = null;

    constructor() {
        this.pool = new Pool({
            user: "postgres",
            host: "localhost",
            database: "postgres",
            password: 'li9Sv"jN:*B>6rC4}26}',
            port: 5432,
            min: 2,
            idleTimeoutMillis: 10000,
            connectionTimeoutMillis: 30000,
        });
    }

    static getInstance() {
        if (!PgConnection.instance) {
            PgConnection.instance = new PgConnection();
        }
        return PgConnection.instance;
    }
}

export class PgUnitOfWork extends UnitOfWork<PoolClient> {
    private pool: Pool;
    private client: PoolClient | null = null;
    private RECONNECTION_ATTEMPTS = 5;
    private RECONNECTION_DELAY = 3000;

    constructor() {
        super();
        this.pool = PgConnection.getInstance().pool;
    }

    async start(): Promise<void> {
        for (let i = 0; i < this.RECONNECTION_ATTEMPTS; i += 1) {
            try {
                this.client = await this.pool.connect();
                await this.client.query("BEGIN");
                return;
            } catch (error) {
                const err = error as Error;
                const isTimeout =
                    err.message.includes("timeout") ||
                    err.message.includes("ETIMEDOUT") ||
                    err.message.includes("ECONNREFUSED");
                if (i === this.RECONNECTION_ATTEMPTS - 1) {
                    if (isTimeout) throw new DBConnectionTimeoutError();
                    throw error;
                }
                await new Promise((res) => {
                    setTimeout(res, this.RECONNECTION_DELAY);
                });
            }
        }
    }

    async commit(): Promise<void> {
        if (this.client) await this.client.query("COMMIT");
    }

    async rollback(): Promise<void> {
        if (this.client) await this.client.query("ROLLBACK");
    }

    async dispose(): Promise<void> {
        if (this.client) {
            this.client.release();
            this.client = null;
        }
    }

    async execute<TResponse>(callback: () => Promise<TResponse>): Promise<TResponse> {
        try {
            await this.start();
            const r = await callback();
            if (r instanceof Right) await this.commit();
            if (r instanceof Left) await this.rollback();
            return r;
        } catch (error) {
            await this.rollback();
            throw error;
        } finally {
            await this.dispose();
        }
    }

    getTransaction(): PoolClient {
        if (!this.client) throw new DbTransactionNotPreparedError("A transação com o banco de dados não foi iniciada.");
        return this.client;
    }
}
