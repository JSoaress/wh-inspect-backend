import { ExpressHttpServer } from "./express/express-server.http";
import { userRoutes } from "./express/routes/users.routes";

export class HttpController {
    constructor(private httpServer: ExpressHttpServer) {}

    setup() {
        this.httpServer.register(userRoutes);
    }
}
