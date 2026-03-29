/* eslint-disable max-classes-per-file */
import { HookHubError } from "./base";

export abstract class SystemError extends HookHubError {
    constructor(types: string[], message: string) {
        super(["system", ...types], message, false);
    }
}

export class UndefinedFreemiumPlanError extends SystemError {
    constructor() {
        super(["plan_freemium", "not_configured"], "O plano Freemium não foi configurado.");
    }
}

export class SystemParameterNotConfiguredError extends SystemError {
    constructor(key: string) {
        super(["params", key, "not_configured"], `O parâmetro de sistema "${key}" não foi configurado.`);
    }
}

export class RequestLimitExceededError extends SystemError {
    constructor() {
        super(["http", "request", "rate_limit", "exceeded"], "Limite de requisições excedido, aguarde um momento.");
    }
}
