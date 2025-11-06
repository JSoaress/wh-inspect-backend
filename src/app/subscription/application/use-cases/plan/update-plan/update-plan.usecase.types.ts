import { Either } from "ts-arch-kit/dist/core/helpers";
import { PrimaryKey } from "ts-arch-kit/dist/core/models";

import { NotFoundModelError, ValidationError } from "@/app/_common";
import { Plan, UpdatePlanDTO } from "@/app/subscription/domain/models/plan";
import { IRepositoryFactory } from "@/infra/database";

export type UpdatePlanUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type UpdatePlanUseCaseInput = UpdatePlanDTO & {
    id: PrimaryKey;
};

export type UpdatePlanUseCaseOutput = Either<NotFoundModelError | ValidationError, Plan>;
