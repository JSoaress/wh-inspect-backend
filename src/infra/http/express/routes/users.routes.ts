import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { userJsonPresenter } from "@/infra/presenters/json";

import { ExpressHttpServer } from "../express-server.http";

export function usersRouter(httpServer: ExpressHttpServer) {
    httpServer.route({
        method: "post",
        path: "/users",
        statusCode: HttpStatusCodes.CREATED,
        useCase(factory) {
            return factory.createUserUseCase();
        },
        presenter: (o) => userJsonPresenter.present(o),
    });
    httpServer.route({
        method: "patch",
        auth: true,
        path: "/users",
        useCase(factory) {
            return factory.updateUserUseCase();
        },
        presenter: (o) => userJsonPresenter.present(o),
    });
    httpServer.route({
        method: "post",
        path: "/users/activate",
        statusCode: HttpStatusCodes.NO_CONTENT,
        useCase(factory) {
            return factory.activateUserUseCase();
        },
    });
    httpServer.route({
        method: "post",
        path: "/users/change-password",
        auth: true,
        useCase(factory) {
            return factory.changePasswordUseCase();
        },
    });
    httpServer.route({
        method: "put",
        path: "/users/change-cli-token",
        auth: true,
        useCase(factory) {
            return factory.changeUserCliTokenUseCase();
        },
    });
}
