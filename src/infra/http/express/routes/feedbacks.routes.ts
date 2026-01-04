import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { ExpressRouter } from "../express-router";
import { isAdmin } from "../middlewares";

const feedbacksRoutes = new ExpressRouter("/feedbacks", true);

feedbacksRoutes.register({
    method: "get",
    path: "/",
    useCase(factory) {
        return factory.fetchFeedbacksUseCase();
    },
});
feedbacksRoutes.register({
    method: "post",
    path: "/",
    buildInput(req) {
        return { ...req.body, userAgent: req.headers["user-agent"] };
    },
    statusCode: HttpStatusCodes.CREATED,
    useCase(factory) {
        return factory.createFeedbackUseCase();
    },
});
feedbacksRoutes.register({
    method: "patch",
    path: "/:feedback",
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

export { feedbacksRoutes };
