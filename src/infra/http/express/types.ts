/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler, Request, RequestHandler } from "express";
import { HttpMethods } from "ts-arch-kit/dist/http";

import { UseCase } from "@/app/_common";
import { UseCaseFactory } from "@/app/_common/application";

export type HttpResult =
    | void
    | unknown
    | {
          body?: unknown;
          statusCode?: number;
      };

export type RouteHandler = (useCaseFactory: UseCaseFactory, req: Request) => Promise<HttpResult>;

export type MiddlewareFactory = (factory: UseCaseFactory) => RequestHandler | ErrorRequestHandler;

export type AuthMiddlewareFactory = (factory: UseCaseFactory) => RequestHandler;

export type MiddlewareConfig = {
    position: "before" | "after";
    middleware: MiddlewareFactory;
};

export type Presenter<T = any> = (output: T) => any;

export type RouteDefinition = {
    path: string;
    method: HttpMethods;
    auth?: boolean;
    statusCode?: number;
    middlewares?: (factory: UseCaseFactory) => RequestHandler[];
    useCase?: (factory: UseCaseFactory) => UseCase<any, any>;
    buildInput?: (req: Request) => Record<string, unknown>;
    handler?: RouteHandler;
    presenter?: Presenter;
};
