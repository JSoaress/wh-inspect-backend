/* eslint-disable max-classes-per-file */
import { BasicError } from "ts-arch-kit/dist/core/errors";

export class DBConnectionTimeoutError extends BasicError {
    constructor() {
        super("", false);
    }
}

export class DbTransactionNotPreparedError extends BasicError {
    constructor(message: string) {
        super(message, false);
    }
}
