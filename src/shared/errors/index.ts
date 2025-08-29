// eslint-disable-next-line max-classes-per-file
import { BasicError } from "ts-arch-kit/dist/core/errors";

export class MissingDependencyError extends BasicError {
    constructor(service: string) {
        super(`Nenhum serviço do tipo "${service}" foi configurado.`, false);
    }
}

export class HttpRouteNotFoundError extends BasicError {
    constructor(private method: string, private url: string) {
        super(`A rota HTTP solicitada não está registrada.`, false);
    }

    toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            method: this.method,
            url: this.url,
        };
    }
}
