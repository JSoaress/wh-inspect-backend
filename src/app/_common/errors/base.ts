/* eslint-disable max-classes-per-file */
import { BasicError } from "ts-arch-kit/dist/core/errors";

export abstract class HookHubError extends BasicError {
    constructor(private types: string[], message: string, isOperational: boolean) {
        super(message, isOperational);
    }

    toJSON(): Record<string, unknown> {
        return {
            type: this.types.join("."),
            ...super.toJSON(),
        };
    }
}

export class UnknownError extends HookHubError {
    constructor(error: unknown) {
        const message = ["Erro desconhecido."];
        let isOperational = true;
        if (error instanceof Error) {
            isOperational = false;
            message.push("MOTIVO:", error.message);
        }
        super(["system", "unknown"], message.join(" "), isOperational);
    }
}

export class NotFoundModelError extends HookHubError {
    constructor(model: string, readonly pk: unknown) {
        super(["resource", model.toLowerCase(), "not_found"], `O objeto do tipo "${model}" não foi encontrado.`, true);
    }

    toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            pk: this.pk,
        };
    }
}
