/* eslint-disable max-classes-per-file */
import { BasicError } from "ts-arch-kit/dist/core/errors";

export class ValidationError extends BasicError {
    constructor(model: string, private errors: Record<string, string[]>) {
        super(`Erro de validação em "${model}"`, true);
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

export class InvalidPasswordError extends BasicError {
    constructor(message: string) {
        super(message, true);
    }
}

export class PasswordDoNotMatchError extends BasicError {
    constructor() {
        super("As senhas não conferem.", true);
    }
}

export class UnknownError extends BasicError {
    constructor(error: unknown) {
        const message = ["Erro desconhecido."];
        let isOperational = true;
        if (error instanceof Error) {
            isOperational = false;
            message.push("MOTIVO:", error.message);
        }
        super(message.join(" "), isOperational);
    }
}

export class NotFoundModelError extends BasicError {
    constructor(model: string, readonly pk: unknown) {
        super(`O objeto do tipo "${model}" não foi encontrado.`, true);
    }

    toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            pk: this.pk,
        };
    }
}

export class MissingParamError extends BasicError {
    constructor(param: string, scope: "path" | "body" | "query" = "path") {
        super(
            `O parâmetro '${param}' não foi encontrado. Certifique-se de incluir o parâmetro na seção '${scope}' para prosseguir com a requisição.`,
            true
        );
    }
}

export class InvalidCredentialsError extends BasicError {
    constructor() {
        super("Credenciais inválidas.", true);
    }
}

export class InvalidTokenError extends BasicError {
    constructor(message = "Token inválido.") {
        super(message, true);
    }
}

export class ConflictError extends BasicError {
    constructor(message: string) {
        super(message, true);
    }
}

export class EmailTakenError extends ConflictError {
    constructor(email: string) {
        super(`O email "${email}" já está em uso por outro usuário.`);
    }
}

export class UsernameTakenError extends ConflictError {
    constructor(username: string) {
        super(`O nome de usuário "${username}" já está em uso.`);
    }
}

export class ForbiddenError extends BasicError {
    constructor(message = "Você não possui permissão para acessar o recurso.") {
        super(message, true);
    }
}

export class InvalidUserError extends BasicError {
    constructor() {
        super("O usuário está inválido", true);
    }
}

export class InvalidSubscriptionActionError extends BasicError {
    constructor(action: string) {
        super(`A ação "${action}" não é válida.`, true);
    }
}

export class NoSubscriptionPlanError extends ConflictError {
    constructor() {
        super("O usuário não possui um plano de assinatura ativo.");
    }
}

export class PlanLimitReachedError extends ConflictError {
    constructor(private resource: string, private max = 0) {
        let message = `Seu plano atingiu o limite máximo de ${resource}/mês.`;
        if (resource === "replay") message = "Seu plano não permite realizar replays de webhooks.";
        if (resource === "projects") message = "Seu plano atingiu o limite máximo de projetos.";
        super(message);
    }

    toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            resource: this.resource,
            max: this.max,
        };
    }
}

export class UndefinedFreemiumPlanError extends BasicError {
    constructor() {
        super("O plano Freemium não foi configurado.", false);
    }
}

export class SystemParameterNotConfiguredError extends BasicError {
    constructor(key: string) {
        super(`O parâmetro de sistema "${key}" não foi configurado.`, false);
    }
}

export class UserHasNoActiveSubscriptionError extends BasicError {
    constructor() {
        super("Você não possui uma assinatura ativa.", true);
    }
}

export class RequestLimitExceededError extends BasicError {
    constructor() {
        super("Limite de requisições excedido, aguarde um momento.", true);
    }
}
