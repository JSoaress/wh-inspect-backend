import cors from "cors";
import express, { Request, Response, NextFunction } from "express";

import { UseCaseFactory } from "@/app/_common/application";
import { env } from "@/shared/config/environment";

import { ExpressRouter, RouteDefinition, RouteHandler } from "./express-router";
import * as middlewares from "./middlewares";

export class ExpressHttpServer {
    private app: express.Express;

    constructor(private baseUrl: string, private useCaseFactory: UseCaseFactory) {
        this.app = express();
        this.app.use(express.json());
        this.app.use(cors());
        // this.app.use(helmet(opt.helmetOptions));
    }

    register(...controllers: ExpressRouter[]): void {
        const allRoutes = controllers.flatMap((controller) => controller.getRoutes());
        allRoutes.forEach((route) => {
            const { method, path } = route;
            const url = [this.baseUrl, ...path.split("/").filter(Boolean)].join("/");
            if (env.NODE_ENV !== "production") console.log(`[${method.toUpperCase()}] ${url}`);
            this.app[method](url, this.buildHandler(route), middlewares.formatRespose);
        });
    }

    private buildHandler(route: RouteDefinition) {
        const { handler: customHandler, statusCode } = route;
        const handler = customHandler || this.buildDefaultHandler(route);
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await handler(this.useCaseFactory, req, res, next);
                res.locals.statusCode = statusCode;
                next();
            } catch (error) {
                next(error);
            }
        };
    }

    private buildDefaultHandler({ useCase: useCaseFn, buildInput }: RouteDefinition): RouteHandler {
        return async (useCaseFactory, req, res, next) => {
            if (!useCaseFn) return next();
            const input = buildInput ? buildInput(req) : req.body;
            const useCase = useCaseFn(useCaseFactory);
            const response = await useCase.execute(input);
            if (response.isLeft()) next(response.value);
            res.locals.body = response.value;
            return undefined;
        };
    }

    listen(port: number, callback?: (p: number) => void): void {
        this.app.use(middlewares.notFoundRoute);
        this.app.use(middlewares.errorHandler);
        const cb = callback || ((p: number) => console.info(`Server ready and running on port ${p} with express.`));
        this.app.listen(port, () => cb(port));
    }
}
