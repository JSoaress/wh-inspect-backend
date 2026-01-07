import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { ExpressHttpServer } from "../express-server.http";
import { isAdmin } from "../middlewares";

export function plansRouter(httpServer: ExpressHttpServer) {
    httpServer.route({
        method: "get",
        path: "/plans",
        auth: true,
        middlewares() {
            return [isAdmin];
        },
        useCase(factory) {
            return factory.fetchPlansUseCase();
        },
    });
    httpServer.route({
        method: "post",
        path: "/plans",
        auth: true,
        middlewares() {
            return [isAdmin];
        },
        statusCode: HttpStatusCodes.CREATED,
        useCase(factory) {
            return factory.createPlanUseCase();
        },
    });
    httpServer.route({
        method: "patch",
        path: "/plans/:plan",
        auth: true,
        middlewares() {
            return [isAdmin];
        },
        buildInput(req) {
            return { ...req.body, id: req.params.plan };
        },
        useCase(factory) {
            return factory.updatePlanUseCase();
        },
    });
    httpServer.route({
        method: "delete",
        path: "/plans/:plan",
        auth: true,
        middlewares() {
            return [isAdmin];
        },
        buildInput(req) {
            return { id: req.params.plan };
        },
        useCase(factory) {
            return factory.deletePlanUseCase();
        },
    });
    httpServer.route({
        method: "post",
        path: "/plans/:plan/subscribe",
        auth: true,
        statusCode: HttpStatusCodes.CREATED,
        buildInput(req) {
            return { ...req.body, selectedPlanId: req.params.plan };
        },
        useCase(factory) {
            return factory.subscribePlanUseCase();
        },
    });
}
