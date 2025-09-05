import { Request, Response } from "express";
import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { Plan } from "@/app/subscription/domain/models/plan";
import { User } from "@/app/users/domain/models/user";
import * as presenters from "@/infra/presenters/json";

export function formatRespose(req: Request, res: Response) {
    const { statusCode, body } = res.locals;
    if (!(body instanceof Object)) return res.status(statusCode || HttpStatusCodes.OK).json(body);
    switch (body.constructor) {
        case User:
            return res.status(statusCode || HttpStatusCodes.OK).json(presenters.userJsonPresenter.present(body));
        case Plan:
            return res.status(statusCode || HttpStatusCodes.OK).json(presenters.planJsonPresenter.present(body));
        default:
            return res.status(statusCode || HttpStatusCodes.OK).json(body);
    }
}
