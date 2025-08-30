import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { ExpressRouter } from "../express-router";

const userRoutes = new ExpressRouter("/users");

userRoutes.register({
    path: "/",
    method: "post",
    statusCode: HttpStatusCodes.CREATED,
    useCase(factory) {
        return factory.createUserUseCase();
    },
});
userRoutes.register({
    path: "/activate",
    method: "post",
    statusCode: HttpStatusCodes.NO_CONTENT,
    useCase(factory) {
        return factory.activateUserUseCase();
    },
});

export { userRoutes };
