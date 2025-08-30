import { Request, Response, NextFunction } from "express";

import { InvalidTokenError } from "@/app/_common";
import { CheckAuthenticatedUserUseCase } from "@/app/users/application/use-cases/users/check-authenticated-user";
import { GetUserByIdUseCase } from "@/app/users/application/use-cases/users/get-user-by-id";

export function authorization(useCase: CheckAuthenticatedUserUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const header = req.headers.authorization;
        if (!header) return next(new InvalidTokenError("Token de autenticação não informado."));
        const [, authToken] = header.split(" ");
        const result = await useCase.execute({ token: authToken });
        if (result.isLeft()) return next(result.value);
        req.requestUser = result.value;
        return next();
    };
}

export function authorizationBasedUser(useCase: GetUserByIdUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { user } = req.params;
        const result = await useCase.execute({ id: user });
        if (result.isLeft()) return next(result.value);
        req.requestUser = result.value;
        return next();
    };
}
