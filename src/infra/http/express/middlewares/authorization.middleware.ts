import { Request, Response, NextFunction } from "express";

import { ForbiddenError, InvalidTokenError } from "@/app/_common";
import { AuthenticatedUserDecorator } from "@/app/users/application/use-cases/users/authenticated-user-decorator";

export function authorization(useCase: AuthenticatedUserDecorator) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const header = req.headers.authorization;
        if (!header) return next(new InvalidTokenError("Token de autenticação não informado."));
        const [, authToken] = header.split(" ");
        const result = await useCase.execute({ type: "token", token: authToken });
        if (result.isLeft()) return next(result.value);
        req.requestUser = result.value;
        return next();
    };
}

export function authorizationBasedUser(useCase: AuthenticatedUserDecorator) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { username } = req.params;
        const result = await useCase.execute({ type: "username", username });
        if (result.isLeft()) return next(result.value);
        req.requestUser = result.value;
        return next();
    };
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.requestUser.isAdmin) return next(new ForbiddenError());
    return next();
}
