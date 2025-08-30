import { Request, Response, NextFunction } from "express";

import { HttpRouteNotFoundError } from "@/shared/errors";

export function notFoundRoute(req: Request, res: Response, next: NextFunction) {
    const error = new HttpRouteNotFoundError(req.method, req.url);
    next(error);
}
