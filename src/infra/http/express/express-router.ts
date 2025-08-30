import { Request, Response, NextFunction, RequestHandler } from "express";
import { HttpMethods } from "ts-arch-kit/dist/http";

import { UseCase } from "@/app/_common";
import { UseCaseFactory } from "@/app/_common/application";

export type RouteHandler = (
    useCaseFactory: UseCaseFactory,
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>;

export type RouteDefinition = {
    path: string;
    method: HttpMethods;
    auth?: boolean;
    statusCode?: number;
    middlewares?: (factory: UseCaseFactory) => RequestHandler[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useCase?: (factory: UseCaseFactory) => UseCase<any, any>;
    buildInput?: (req: Request) => Record<string, unknown>;
    handler?: RouteHandler;
};

export class ExpressRouter {
    private routes: RouteDefinition[] = [];

    constructor(private baseUrl?: string, private auth?: boolean, readonly middlewares?: RequestHandler[]) {}

    register({ path, auth, middlewares: routeMiddlewares, ...params }: RouteDefinition) {
        const withAuth = typeof auth === "boolean" ? auth : !!this.auth;
        const mergedMiddlewares = (factory: UseCaseFactory): RequestHandler[] => {
            const global = this.middlewares ?? [];
            const local = routeMiddlewares ? routeMiddlewares(factory) : [];
            return [...global, ...local];
        };
        this.routes.push({
            path: `${this.baseUrl ?? ""}${path}`,
            auth: withAuth,
            middlewares: mergedMiddlewares,
            ...params,
        });
    }

    getRoutes(): RouteDefinition[] {
        return [...this.routes];
    }
}
