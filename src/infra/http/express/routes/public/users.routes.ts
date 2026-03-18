import { Router } from "express";
import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { UseCaseFactory } from "@/app/_common/application";
import { userJsonPresenter } from "@/infra/presenters/json";

import { httpPost } from "../../http-routes";

export function usersRouter(useCaseFactory: UseCaseFactory): Router {
    const router = Router();

    router.post("/", httpPost(useCaseFactory.createUserUseCase(), { presenter: userJsonPresenter }));
    router.post("/activate", httpPost(useCaseFactory.activateUserUseCase(), { statusCode: HttpStatusCodes.NO_CONTENT }));

    return router;
}
