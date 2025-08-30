import { ExpressRouter } from "../express-router";

const authRoutes = new ExpressRouter("/auth");

authRoutes.register({
    method: "post",
    path: "/login",
    useCase(factory) {
        return factory.authenticateUserUseCase();
    },
});

export { authRoutes };
