import { Request, Response, NextFunction } from "express";

import { Logger } from "@/infra/adapters/logger";

export function auditLog(logger: Logger, action: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        res.on("finish", () => {
            if (res.statusCode < 400) {
                logger.log({
                    type: "other",
                    level: "info",
                    message: "Ação realizada",
                    externalId: req.trace.requestId,
                    action,
                    userId: req.requestUser.id,
                    userAgent: req.headers["user-agent"],
                    ip: req.ip,
                    duration: Date.now() - req.trace.startAt,
                    project: req.params.slug,
                    webhookId: req.params.webhook,
                });
            }
        });
        return next();
    };
}
