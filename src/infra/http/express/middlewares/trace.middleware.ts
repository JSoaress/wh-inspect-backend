import { Request, Response, NextFunction } from "express";

import { UUID } from "@/infra/adapters/uuid";

export function trace(req: Request, res: Response, next: NextFunction) {
    req.trace = { requestId: UUID.generate("v4"), startAt: Date.now() };
    return next();
}
