import { Either } from "ts-arch-kit/dist/core/helpers";

import { InvalidSubscriptionActionError, NoSubscriptionPlanError, PlanLimitReachedError } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type CheckSubscriptionConsumptionUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type CheckSubscriptionConsumptionUseCaseInput = {
    action: string;
    requestUser: User;
};

export type CheckSubscriptionConsumptionUseCaseOutput = Either<
    NoSubscriptionPlanError | InvalidSubscriptionActionError | PlanLimitReachedError,
    true
>;
