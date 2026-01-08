/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { BasicError } from "ts-arch-kit/dist/core/errors";
import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import * as appErrors from "@/app/_common/errors";
import { logger } from "@/infra/adapters/logger";
import { HttpRouteNotFoundError } from "@/shared/errors";

export function errorHandler(err: Error | BasicError, req: Request, res: Response, next: NextFunction) {
    const baseLog = {
        level: "error",
        message: err.message,
        method: req.method,
        url: req.originalUrl,
        externalId: req.trace.requestId,
        duration: Date.now() - req.trace.startAt,
        stack: err.stack,
    };
    if (!(err instanceof BasicError)) {
        logger.log({
            ...baseLog,
            type: "http",
            status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
            error: err as unknown as Record<string, unknown>,
            tags: ["http", "non-operational"],
        });
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
    logger.log({
        ...baseLog,
        type: "http",
        status: HttpStatusCodes.BAD_REQUEST,
        error: err.toJSON(),
        tags: ["http", "operational"],
    });
    switch (err.constructor) {
        // 400
        case appErrors.MissingParamError:
            return res.status(HttpStatusCodes.BAD_REQUEST).json(err);
        // 401
        case appErrors.InvalidTokenError:
        case appErrors.InvalidCredentialsError:
        case appErrors.PasswordDoNotMatchError:
            return res.status(HttpStatusCodes.UNAUTHORIZED).json(err);
        // 403
        case appErrors.ForbiddenError:
            return res.status(HttpStatusCodes.FORBIDDEN).json(err);
        // 404
        case HttpRouteNotFoundError:
        case appErrors.NotFoundModelError:
            return res.status(HttpStatusCodes.NOT_FOUND).json(err);
        // 409
        case appErrors.EmailTakenError:
        case appErrors.InvalidUserError:
        case appErrors.ConflictError:
        case appErrors.UsernameTakenError:
        case appErrors.InvalidSubscriptionActionError:
        case appErrors.NoSubscriptionPlanError:
        case appErrors.PlanLimitReachedError:
        case appErrors.UserHasNoActiveSubscriptionError:
            return res.status(HttpStatusCodes.CONFLICT).json(err);
        // 422
        case appErrors.ValidationError:
        case appErrors.InvalidPasswordError:
            return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json(err);
        // 500
        default:
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
}
