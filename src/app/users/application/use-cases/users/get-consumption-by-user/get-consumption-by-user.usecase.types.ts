import { Either } from "ts-arch-kit/dist/core/helpers";

import { NoSubscriptionPlanError } from "@/app/_common";
import { WebhookUsageDTO } from "@/app/projects/domain/models/webhook-usage";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type GetConsumptionByUserUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type GetConsumptionByUserUseCaseInput = {
    requestUser: AuthenticatedUserDTO;
};

type SubscriptionConsumption = Pick<WebhookUsageDTO, "maxEvents" | "eventsCount"> & {
    yearMonth: string;
    maxProjects: number;
    projects: number;
};

export type GetConsumptionByUserUseCaseOutput = Either<NoSubscriptionPlanError, SubscriptionConsumption>;
