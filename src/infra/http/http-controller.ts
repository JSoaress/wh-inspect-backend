import { Express } from "express";
import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { UseCaseFactory } from "@/app/_common/application";

import * as middlewares from "./express/middlewares";
import * as router from "./express/routes";

export class HttpController {
    constructor(private httpServer: Express, private useCaseFactory: UseCaseFactory) {}

    setup() {
        this.httpServer.use(middlewares.trace);
        this.httpServer.use(middlewares.queryOptions);

        this.httpServer.get("/api/ping", (req, res) => {
            return res.status(HttpStatusCodes.OK).send("pong");
        });

        this.httpServer.use("/api", router.publicRouter(this.useCaseFactory));

        this.httpServer.use(
            "/api",
            middlewares.authorization(() => this.useCaseFactory.authenticatedUserDecorator())
        );

        this.httpServer.use("/api", router.privateRouter(this.useCaseFactory));

        this.httpServer.use(middlewares.notFoundRoute);
        this.httpServer.use(middlewares.errorHandler());
    }
}
