import { ExpressHttpServer } from "./express/express-server.http";
import * as routes from "./express/routes";

export class HttpController {
    constructor(private httpServer: ExpressHttpServer) {}

    setup() {
        this.httpServer.register(routes.userRoutes, routes.projectsRoutes, routes.authRoutes);
    }
}
