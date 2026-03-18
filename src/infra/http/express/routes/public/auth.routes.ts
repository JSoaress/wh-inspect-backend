import { Router } from "express";
import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { UseCaseFactory } from "@/app/_common/application";

import { httpPost } from "../../http-routes";

export function authRouter(useCaseFactory: UseCaseFactory): Router {
    const router = Router();

    router.post("/login", httpPost(useCaseFactory.authenticateUserUseCase(), { statusCode: HttpStatusCodes.OK }));
    router.post(
        "/password-recovery/send-email",
        httpPost(useCaseFactory.sendEmailForPasswordRecoveryUseCase(), { statusCode: HttpStatusCodes.OK })
    );
    router.post(
        "/password-recovery/reset",
        httpPost(useCaseFactory.resetPasswordUseCase(), { statusCode: HttpStatusCodes.OK })
    );

    return router;
}
