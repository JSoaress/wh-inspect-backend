import { BasicError } from "ts-arch-kit/dist/core/errors";

export class QueueConnectionError extends BasicError {
    constructor(message: string) {
        super(message, false);
    }
}
