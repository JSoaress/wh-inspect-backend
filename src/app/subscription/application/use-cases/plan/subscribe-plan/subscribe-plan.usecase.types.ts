import { Either } from "ts-arch-kit/dist/core/helpers";

import { NotFoundModelError, ValidationError } from "@/app/_common";
import { Subscription } from "@/app/subscription/domain/models/subscription";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type SubscribePlanUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type SubscribePlanUseCaseInput = {
    selectedPlanId: string;
    paymentMethod: "pix" | "credit_card";
    requestUser: User;
};

export type SubscribePlanUseCaseOutput = Either<NotFoundModelError | ValidationError, Subscription>;
