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

export { plansRoutes };
