import { ExpressHttpServer } from "./express/express-server.http";
import * as middlewares from "./express/middlewares";
import * as router from "./express/routes";

export class HttpController {
    constructor(private httpServer: ExpressHttpServer) {}

    setup() {
        this.httpServer.useMiddleware({ position: "before", middleware: () => middlewares.trace });
        this.httpServer.useMiddleware({ position: "before", middleware: () => middlewares.queryOptions });
        this.httpServer.useAuthMiddleware((factory) =>
            middlewares.authorization(factory.authenticatedUserDecorator(factory.checkAuthenticatedUserUseCase()))
        );

        this.httpServer.route({
            method: "get",
            path: "/ping",
            handler: async () => {
                return "pong";
            },
        });

        router.usersRouter(this.httpServer);
        router.projectsRouter(this.httpServer);
        router.authRouter(this.httpServer);
        router.webhooksRouter(this.httpServer);
        router.plansRouter(this.httpServer);
        router.feedbackRouter(this.httpServer);

        this.httpServer.useMiddleware({ position: "after", middleware: () => middlewares.notFoundRoute });
        this.httpServer.useMiddleware({
            position: "after",
            middleware: (factory) => middlewares.errorHandler(factory.logger),
        });
    }
}
