import { ExpressHttpServer } from "../express-server.http";

export function authRouter(httpServer: ExpressHttpServer) {
    httpServer.route({
        method: "post",
        path: "/auth/login",
        useCase(factory) {
            return factory.authenticateUserUseCase();
        },
    });
    httpServer.route({
        method: "post",
        path: "/auth/password-recovery/send-email",
        useCase(factory) {
            return factory.sendEmailForPasswordRecoveryUseCase();
        },
    });
    httpServer.route({
        method: "post",
        path: "/auth/password-recovery/reset",
        useCase(factory) {
            return factory.resetPasswordUseCase();
        },
    });
}
