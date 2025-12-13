import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { ExpressRouter } from "../express-router";

const userRoutes = new ExpressRouter("/users");

userRoutes.register({
    method: "post",
    path: "/",
    statusCode: HttpStatusCodes.CREATED,
    useCase(factory) {
        return factory.createUserUseCase();
    },
});
userRoutes.register({
    method: "post",
    path: "/activate",
    statusCode: HttpStatusCodes.NO_CONTENT,
    useCase(factory) {
        return factory.activateUserUseCase();
    },
});
userRoutes.register({
    method: "post",
    path: "/change-password",
    auth: true,
    useCase(factory) {
        return factory.changePasswordUseCase();
    },
});
userRoutes.register({
    method: "put",
    path: "/change-cli-token",
    auth: true,
    useCase(factory) {
        return factory.changeUserCliTokenUseCase();
    },
});

export { userRoutes };
