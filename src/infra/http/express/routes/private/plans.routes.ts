import { Router } from "express";
import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { UseCaseFactory } from "@/app/_common/application";

import { httpDelete, httpGet, httpPost, httpPutOrPatch } from "../../http-routes";
import { isAdmin } from "../../middlewares";

export function plansRouter(useCaseFactory: UseCaseFactory): Router {
    const router = Router();

    router.get("/", isAdmin, httpGet(useCaseFactory.fetchPlansUseCase()));
    router.post("/", isAdmin, httpPost(useCaseFactory.createPlanUseCase()));
    router.patch("/:id", isAdmin, httpPutOrPatch(useCaseFactory.updatePlanUseCase()));
    router.delete("/:id", isAdmin, httpDelete(useCaseFactory.deletePlanUseCase()));

    router.post("/:id/subscribe", async (req, res, next) => {
        const { requestUser } = req;
        const { id: selectedPlanId } = req.params;
        const useCase = useCaseFactory.subscribePlanUseCase();
        const response = await useCase.execute({ ...req.body, selectedPlanId, requestUser });
        if (response.isLeft()) return next(response.value);
        return res.status(HttpStatusCodes.CREATED).json(response.value);
    });

    return router;
}
