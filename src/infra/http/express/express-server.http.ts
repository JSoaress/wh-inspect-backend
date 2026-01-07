/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from "cors";
import express from "express";
import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { UseCaseFactory } from "@/app/_common/application";
import { env } from "@/shared/config/environment";

import { AuthMiddlewareFactory, MiddlewareConfig, RouteDefinition, RouteHandler } from "./types";

export class ExpressHttpServer {
    private app: express.Express;
    private globalMiddlewares: MiddlewareConfig[] = [];
    private authMiddleware?: AuthMiddlewareFactory;

    constructor(private baseUrl: string, private useCaseFactory: UseCaseFactory) {
        this.app = express();
        this.app.use(express.json({ limit: "1mb" }));
        this.app.use(cors());
        // this.app.use(helmet(opt.helmetOptions));
    }

    useMiddleware({ middleware }: MiddlewareConfig) {
        this.app.use(middleware(this.useCaseFactory));
    }

    useAuthMiddleware(middleware: AuthMiddlewareFactory) {
        this.authMiddleware = middleware;
    }

    route(def: RouteDefinition): void {
        const { method, path, auth, middlewares } = def;
        const url = this.buildUrl(this.baseUrl, ...path.split("/"));
        if (env.NODE_ENV !== "production") console.info(`[${method.toUpperCase()}] ${url}`);
        const pipeline: express.RequestHandler[] = [];
        if (auth && this.authMiddleware) pipeline.push(this.authMiddleware(this.useCaseFactory));
        if (middlewares) pipeline.push(...middlewares(this.useCaseFactory));
        pipeline.push(this.buildHandler(def));
        this.app[method](url, ...pipeline);
    }

    private buildUrl(...paths: string[]): string {
        let url = paths.join("/").replace(/\/{2,}/g, "/");
        if (url.endsWith("/")) url = url.replace(/\/+$/, "");
        return url;
    }

    private buildHandler(route: RouteDefinition): express.RequestHandler {
        const handler = route.handler ?? this.buildDefaultHandler(route);
        return async (req, res, next) => {
            try {
                const result = await handler(this.useCaseFactory, req);
                if (!result) return res.sendStatus(route.statusCode ?? HttpStatusCodes.NO_CONTENT);
                // if (typeof result === "object" && "body" in result) {
                //     return res
                //         .status((result as any).statusCode ?? route.statusCode ?? HttpStatusCodes.OK)
                //         .json(result.body);
                // }
                const output = route.presenter ? route.presenter(result) : result;
                return res.status(route.statusCode ?? HttpStatusCodes.OK).send(output);
            } catch (error) {
                return next(error);
            }
        };
    }

    private buildDefaultHandler({ useCase: useCaseFn, buildInput }: RouteDefinition): RouteHandler {
        return async (factory, req) => {
            if (!useCaseFn) throw new Error("UseCase not provided.");
            const { requestUser, body, queryOptions } = req;
            const input = buildInput ? { ...buildInput(req), requestUser } : { ...body, requestUser };
            if (req.method === "GET" && !input.queryOptions) input.queryOptions = queryOptions;
            const useCase = useCaseFn(factory);
            const response = await useCase.execute(input);
            if (response.isLeft()) throw response.value;
            return response.value;
        };
    }

    prepareMiddlewares() {
        this.globalMiddlewares
            .filter((mw) => mw.position === "before")
            .forEach((mw) => this.app.use(mw.middleware(this.useCaseFactory)));
        this.globalMiddlewares
            .filter((mw) => mw.position === "after")
            .forEach((mw) => this.app.use(mw.middleware(this.useCaseFactory)));
    }

    listen(port: number, callback?: (p: number) => void): void {
        const cb = callback || ((p: number) => console.info(`Server ready and running on port ${p} with express.`));
        this.app.listen(port, () => cb(port));
    }

    getServer() {
        return this.app;
    }
}
