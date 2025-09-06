import { Request, Response, NextFunction } from "express";

import { CheckSubscriptionConsumptionUseCase } from "@/app/subscription/application/use-cases/subscription/check-subscription-consumption";

export function checkPlanLimit(action: string, useCase: CheckSubscriptionConsumptionUseCase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { requestUser } = req;
        const result = await useCase.execute({ action, requestUser });
        if (result.isLeft()) return next(result.value);
        return next();
    };
}
