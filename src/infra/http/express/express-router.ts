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

    constructor(private baseUrl?: string, private auth?: boolean) {}

    register({ path, auth, ...params }: RouteDefinition) {
        const withAuth = typeof auth === "boolean" ? auth : !!this.auth;
        this.routes.push({ path: `${this.baseUrl ?? ""}${path}`, auth: withAuth, ...params });
    }

    getRoutes(): RouteDefinition[] {
        return [...this.routes];
    }
}
