import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { ExpressRouter } from "../express-router";
import { isAdmin } from "../middlewares";

const plansRoutes = new ExpressRouter("/plans", true, [isAdmin]);

plansRoutes.register({
    method: "get",
    path: "/",
    useCase(factory) {
        return factory.fetchPlansUseCase();
    },
});
plansRoutes.register({
    method: "post",
    path: "/",
    statusCode: HttpStatusCodes.CREATED,
    useCase(factory) {
        return factory.createPlanUseCase();
    },
});
plansRoutes.register({
    method: "patch",
    path: "/:plan",
    buildInput(req) {
        return { ...req.body, id: req.params.plan };
    },
    useCase(factory) {
        return factory.updatePlanUseCase();
    },
});
plansRoutes.register({
    method: "delete",
    path: "/:plan",
    buildInput(req) {
        return { id: req.params.plan };
    },
    useCase(factory) {
        return factory.deletePlanUseCase();
    },
});

export { plansRoutes };
