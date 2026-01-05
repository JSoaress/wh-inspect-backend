import { Request, Response, NextFunction } from "express";
import { HttpStatusCodes } from "ts-arch-kit/dist/http";

export function routeTimeout(ms: number) {
    return (req: Request, res: Response, next: NextFunction) => {
        res.setTimeout(ms, () => {
            if (!res.headersSent) res.status(HttpStatusCodes.REQUEST_TIMEOUT).json({ message: "Request timeout" });
        });
        return next();
    };
}
