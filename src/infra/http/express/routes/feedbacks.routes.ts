import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { ExpressHttpServer } from "../express-server.http";
import { isAdmin } from "../middlewares";

export function feedbackRouter(httpServer: ExpressHttpServer) {
    httpServer.route({
        method: "get",
        path: "/feedbacks",
        auth: true,
        useCase(factory) {
            return factory.fetchFeedbacksUseCase();
        },
    });
    httpServer.route({
        method: "post",
        path: "/feedbacks",
        auth: true,
        buildInput(req) {
            return { ...req.body, userAgent: req.headers["user-agent"] };
        },
        statusCode: HttpStatusCodes.CREATED,
        useCase(factory) {
            return factory.createFeedbackUseCase();
        },
    });
    httpServer.route({
        method: "patch",
        path: "/feedbacks/:feedback",
        auth: true,
        middlewares() {
            return [isAdmin];
        },
        buildInput(req) {
            return { ...req.body, id: req.params.feedback };
        },
        useCase(factory) {
            return factory.updateFeedbackUseCase();
        },
    });
}
