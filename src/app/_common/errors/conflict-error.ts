/* eslint-disable max-classes-per-file */
import { HookHubError } from "./base";

export abstract class ConflictError extends HookHubError {
    constructor(types: string[], message: string) {
        super(["conflict", ...types], message, true);
    }
}

export class EmailTakenError extends ConflictError {
    constructor(email: string) {
        super(["users", "email_taken"], `O email "${email}" já está em uso por outro usuário.`);
    }
}

export class UsernameTakenError extends ConflictError {
    constructor(username: string) {
        super(["users", "username_taken"], `O nome de usuário "${username}" já está em uso.`);
    }
}

export class ProjectSlugTakenError extends ConflictError {
    constructor(slug: string) {
        super(["projects", "slug_taken"], `Você já possui outro projeto utilizando a slug "${slug}".`);
    }
}

export class NoSubscriptionPlanError extends ConflictError {
    constructor() {
        super(["subscription", "no_plan"], "O usuário não possui um plano de assinatura ativo.");
    }
}

export class PlanLimitReachedError extends ConflictError {
    constructor(private resource: string, private max = 0) {
        let message = `Seu plano atingiu o limite máximo de ${resource}/mês.`;
        if (resource === "replay") message = "Seu plano não permite realizar replays de webhooks.";
        if (resource === "projects") message = "Seu plano atingiu o limite máximo de projetos.";
        super(["subscription", "limit_reached", resource], message);
    }

    toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            resource: this.resource,
            max: this.max,
        };
    }
}

export class InvalidSubscriptionActionError extends ConflictError {
    constructor(action: string) {
        super(["subscription", "invalid_action"], `A ação "${action}" não é válida.`);
    }
}

export class InvalidUserError extends ConflictError {
    constructor() {
        super(["users", "invalid"], "O usuário está inválido");
    }
}

export class UserHasNoActiveSubscriptionError extends ConflictError {
    constructor() {
        super(["users", "no_subscription"], "Você não possui uma assinatura ativa.");
    }
}
