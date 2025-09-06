import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { ExpressRouter } from "../express-router";
import { checkPlanLimit } from "../middlewares";

const projectsRoutes = new ExpressRouter("/projects", true);

projectsRoutes.register({
    method: "get",
    path: "/",
    useCase(factory) {
        return factory.fetchProjectsUseCase();
    },
});
projectsRoutes.register({
    method: "post",
    path: "/",
    statusCode: HttpStatusCodes.CREATED,
    middlewares(factory) {
        return [checkPlanLimit("add-project", factory.checkSubscriptionConsumption())];
    },
    useCase(factory) {
        return factory.createProjectUseCase();
    },
});
projectsRoutes.register({
    method: "patch",
    path: "/:project",
    buildInput(req) {
        return { ...req.body, id: req.params.project };
    },
    useCase(factory) {
        return factory.updateProjectUseCase();
    },
});
projectsRoutes.register({
    method: "delete",
    path: "/:project",
    buildInput(req) {
        return { id: req.params.project };
    },
    useCase(factory) {
        return factory.deleteProjectUseCase();
    },
});

export { projectsRoutes };
