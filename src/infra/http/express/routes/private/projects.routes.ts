import { Router } from "express";
import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { UseCaseFactory } from "@/app/_common/application";

import { httpDelete, httpGet, httpPost, httpPutOrPatch } from "../../http-routes";
import { checkPlanLimit } from "../../middlewares";

export function projectsRouter(useCaseFactory: UseCaseFactory): Router {
    const router = Router();

    router.get("/", httpGet(useCaseFactory.fetchProjectsUseCase()));
    router.post(
        "/",
        checkPlanLimit("add-project", useCaseFactory.checkSubscriptionConsumption()),
        httpPost(useCaseFactory.createProjectUseCase())
    );
    router.patch("/:id", httpPutOrPatch(useCaseFactory.updateProjectUseCase()));
    router.delete("/:id", httpDelete(useCaseFactory.deleteProjectUseCase()));

    router.post("/:id/members", httpPutOrPatch(useCaseFactory.manageProjectMembersUseCase()));
    router.get("/:id/webhooks/simplified", async (req, res, next) => {
        const { requestUser, queryOptions } = req;
        const { id: projectId } = req.params;
        const useCase = useCaseFactory.fetchSimplifiedWebhooksUseCase();
        const response = await useCase.execute({ projectId, queryOptions, requestUser });
        if (response.isLeft()) return next(response.value);
        return res.status(HttpStatusCodes.OK).json(response.value);
    });

    return router;
}
