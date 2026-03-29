/* eslint-disable max-classes-per-file */
import { HookHubError } from "./base";

export abstract class AuthError extends HookHubError {
    constructor(types: string[], message: string) {
        super(["auth", ...types], message, true);
    }
}

export class PasswordDoNotMatchError extends AuthError {
    constructor() {
        super(["password_mismatch"], "As senhas não conferem.");
    }
}

export class InvalidCredentialsError extends AuthError {
    constructor() {
        super(["invalid_credentials"], "Credenciais inválidas.");
    }
}

export class InvalidTokenError extends AuthError {
    constructor(message = "Token inválido.") {
        super(["invalid_token"], message);
    }
}

export class ForbiddenError extends AuthError {
    constructor(message = "Você não possui permissão para acessar o recurso.") {
        super(["forbidden"], message);
    }
}
