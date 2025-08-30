import { Request, Response, NextFunction } from "express";
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useCase?: (factory: UseCaseFactory) => UseCase<any, any>;
    buildInput?: (req: Request) => Record<string, unknown>;
    handler?: RouteHandler;
};

export class ExpressRouter {
    private routes: RouteDefinition[] = [];

    constructor(private baseUrl?: string) {}

    register({ path, ...params }: RouteDefinition) {
        this.routes.push({ path: `${this.baseUrl ?? ""}${path}`, ...params });
    }

    getRoutes(): RouteDefinition[] {
        return [...this.routes];
    }
}
