import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { ExpressHttpServer } from "../express-server.http";
import { checkPlanLimit } from "../middlewares";

export function projectsRouter(httpServer: ExpressHttpServer) {
    httpServer.route({
        method: "get",
        path: "/projects",
        auth: true,
        useCase(factory) {
            return factory.fetchProjectsUseCase();
        },
    });
    httpServer.route({
        method: "post",
        path: "/projects",
        auth: true,
        statusCode: HttpStatusCodes.CREATED,
        middlewares(factory) {
            return [checkPlanLimit("add-project", factory.checkSubscriptionConsumption())];
        },
        useCase(factory) {
            return factory.createProjectUseCase();
        },
    });
    httpServer.route({
        method: "patch",
        path: "/projects/:project",
        auth: true,
        buildInput(req) {
            return { ...req.body, id: req.params.project };
        },
        useCase(factory) {
            return factory.updateProjectUseCase();
        },
    });
    httpServer.route({
        method: "delete",
        path: "/projects/:project",
        auth: true,
        statusCode: HttpStatusCodes.NO_CONTENT,
        buildInput(req) {
            return { id: req.params.project };
        },
        useCase(factory) {
            return factory.deleteProjectUseCase();
        },
    });
    httpServer.route({
        method: "post",
        path: "/projects/:project/members",
        auth: true,
        buildInput(req) {
            return { ...req.body, id: req.params.project };
        },
        useCase(factory) {
            return factory.manageProjectMembersUseCase();
        },
    });
    httpServer.route({
        method: "get",
        path: "/projects/:project/webhooks/simplified",
        auth: true,
        buildInput(req) {
            const { project: projectId } = req.params;
            return { projectId };
        },
        useCase(factory) {
            return factory.fetchSimplifiedWebhooksUseCase();
        },
    });
}
