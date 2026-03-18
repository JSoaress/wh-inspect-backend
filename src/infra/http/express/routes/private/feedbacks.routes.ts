import { Router } from "express";

import { UseCaseFactory } from "@/app/_common/application";

import { httpGet, httpPutOrPatch } from "../../http-routes";

export function feedbackRouter(useCaseFactory: UseCaseFactory) {
    const router = Router();

    router.get("/", httpGet(useCaseFactory.fetchFeedbacksUseCase()));
    router.post("/", async (req, res, next) => {
        const { requestUser } = req;
        const useCase = useCaseFactory.createFeedbackUseCase();
        const response = await useCase.execute({ ...req.body, userAgent: req.headers["user-agent"], requestUser });
        if (response.isLeft()) return next(response.value);
        return res.status(200).json(response.value);
    });
    router.patch("/:id", httpPutOrPatch(useCaseFactory.updateFeedbackUseCase()));

    return router;
}
