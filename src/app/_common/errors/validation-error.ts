/* eslint-disable max-classes-per-file */
import { HookHubError } from "./base";

export abstract class UnprocessableEntityError extends HookHubError {
    constructor(types: string[], message: string) {
        super(["validation", ...types], message, true);
    }
}

export class ValidationError extends UnprocessableEntityError {
    constructor(model: string, private errors: Record<string, string[]>) {
        super([model.toLowerCase()], `Erro de validação em "${model}"`);
    }

    getError(prop: string): string[] | null {
        return this.errors[prop] || null;
    }

    setError(key: string, ...errors: string[]) {
        if (this.errors[key]) this.errors[key].push(...errors);
        else this.errors[key] = errors;
    }

    getErrors() {
        return this.errors;
    }

    setErrors(errors: Record<string, string[]>) {
        this.errors = errors;
    }

    toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            errors: this.errors,
        };
    }
}

export class InvalidPasswordError extends UnprocessableEntityError {
    constructor(message: string) {
        super(["invalid_password"], message);
    }
}
