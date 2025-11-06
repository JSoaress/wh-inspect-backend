import { ExpressRouter } from "../express-router";

const authRoutes = new ExpressRouter("/auth");

authRoutes.register({
    method: "post",
    path: "/login",
    useCase(factory) {
        return factory.authenticateUserUseCase();
    },
});
authRoutes.register({
    method: "post",
    path: "/password-recovery/send-email",
    useCase(factory) {
        return factory.sendEmailForPasswordRecoveryUseCase();
    },
});
authRoutes.register({
    method: "post",
    path: "/password-recovery/reset",
    useCase(factory) {
        return factory.resetPasswordUseCase();
    },
});

export { authRoutes };
