/* eslint-disable max-classes-per-file */
import { HookHubError } from "./base";

export abstract class BadRequestError extends HookHubError {
    constructor(types: string[], message: string) {
        super(["bad_request", ...types], message, true);
    }
}

export class MissingParamError extends BadRequestError {
    constructor(param: string, scope: "path" | "body" | "query" = "path") {
        super(
            ["missing_param", scope],
            `O parâmetro '${param}' não foi encontrado. Certifique-se de incluir o parâmetro na seção '${scope}' para prosseguir com a requisição.`
        );
    }
}
