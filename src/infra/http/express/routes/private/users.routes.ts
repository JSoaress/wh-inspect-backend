import { Router } from "express";
import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { UseCaseFactory } from "@/app/_common/application";
import { userJsonPresenter } from "@/infra/presenters/json";

import { httpPost, httpPutOrPatch } from "../../http-routes";

export function usersRouter(useCaseFactory: UseCaseFactory): Router {
    const router = Router();

    router.patch("/", httpPutOrPatch(useCaseFactory.updateUserUseCase(), { presenter: userJsonPresenter }));
    router.post(
        "/change-password",
        httpPost(useCaseFactory.changePasswordUseCase(), { statusCode: HttpStatusCodes.NO_CONTENT })
    );
    router.put("/change-cli-token", async (req, res, next) => {
        const { requestUser } = req;
        const useCase = useCaseFactory.changeUserCliTokenUseCase();
        const response = await useCase.execute({ requestUser });
        if (response.isLeft()) return next(response.value);
        return res.status(HttpStatusCodes.OK).json(response.value);
    });
    router.get("/subscription/consumption", async (req, res, next) => {
        const { requestUser } = req;
        const useCase = useCaseFactory.getConsumptionByUserUseCase();
        const response = await useCase.execute({ requestUser });
        if (response.isLeft()) return next(response.value);
        return res.status(HttpStatusCodes.OK).json(response.value);
    });

    return router;
}
