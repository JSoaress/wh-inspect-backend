import { Router } from "express";
import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { UseCaseFactory } from "@/app/_common/application";

import { checkPlanLimit } from "../../middlewares";

export function webhooksRouter(useCaseFactory: UseCaseFactory): Router {
    const router = Router();

    router.post(
        "/:id/replay",
        checkPlanLimit("replay-event", useCaseFactory.checkSubscriptionConsumption()),
        async (req, res, next) => {
            const { requestUser } = req;
            const { id: webhookLogId } = req.params;
            const useCase = useCaseFactory.replayWebhookUseCase();
            const response = await useCase.execute({ webhookLogId, requestUser });
            if (response.isLeft()) return next(response.value);
            return res.status(HttpStatusCodes.OK).json(response.value);
        }
    );
    router.get("/metrics", async (req, res, next) => {
        const { requestUser } = req;
        const useCase = useCaseFactory.getWebhookMetrics();
        const response = await useCase.execute({ requestUser });
        if (response.isLeft()) return next(response.value);
        return res.status(HttpStatusCodes.OK).json(response.value);
    });
    router.get("/:id", async (req, res, next) => {
        const { requestUser } = req;
        const { id } = req.params;
        const useCase = useCaseFactory.getWebhookUseCase();
        const response = await useCase.execute({ queryOptions: { filter: { id } }, requestUser });
        if (response.isLeft()) return next(response.value);
        return res.status(HttpStatusCodes.OK).json(response.value);
    });

    return router;
}
