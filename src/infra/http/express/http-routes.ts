/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { IPresenter } from "ts-arch-kit/dist/core/helpers";

import { UseCase } from "@/app/_common";

type HttpRouteOptions = {
    statusCode?: number;
    presenter?: IPresenter<any, any>;
};

export function httpGet(useCase: UseCase<any, any>, opt?: HttpRouteOptions) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { statusCode = 200, presenter } = opt || {};
        const { requestUser, queryOptions } = req;
        const response = await useCase.execute({ queryOptions, requestUser });
        if (response.isLeft()) return next(response.value);
        const { count, results } = response.value;
        const output = presenter ? results.map((result: any) => presenter.present(result)) : results;
        return res.status(statusCode).json({ count, results: output });
    };
}

export function httpPost(useCase: UseCase<any, any>, opt?: HttpRouteOptions) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { statusCode = 201, presenter } = opt || {};
        const { requestUser } = req;
        const response = await useCase.execute({ ...req.body, requestUser });
        if (response.isLeft()) return next(response.value);
        return res.status(statusCode).json(presenter ? presenter.present(response.value) : response.value);
    };
}

export function httpPutOrPatch(useCase: UseCase<any, any>, opt?: HttpRouteOptions) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { statusCode = 200, presenter } = opt || {};
        const { requestUser } = req;
        const { id } = req.params;
        const response = await useCase.execute({ ...req.body, id, requestUser });
        if (response.isLeft()) return next(response.value);
        return res.status(statusCode).json(presenter ? presenter.present(response.value) : response.value);
    };
}

export function httpDelete(useCase: UseCase<any, any>, opt?: Pick<HttpRouteOptions, "statusCode">) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { statusCode = 204 } = opt || {};
        const { requestUser } = req;
        const { id } = req.params;
        const response = await useCase.execute({ id, requestUser });
        if (response.isLeft()) return next(response.value);
        return res.status(statusCode).send();
    };
}
