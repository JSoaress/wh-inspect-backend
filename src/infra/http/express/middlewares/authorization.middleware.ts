import { Request, Response, NextFunction } from "express";

import { InvalidTokenError } from "@/app/_common";
import { CheckAuthenticatedUserUseCase } from "@/app/users/application/use-cases/users/check-authenticated-user";

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
