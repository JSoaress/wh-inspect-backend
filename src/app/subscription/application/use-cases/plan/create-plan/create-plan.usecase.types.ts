import { Either } from "ts-arch-kit/dist/core/helpers";

import { ValidationError } from "@/app/_common";
import { CreatePlanDTO, PlanDTO } from "@/app/subscription/domain/models/plan";
import { IRepositoryFactory } from "@/infra/database";

export type CreatePlanUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type CreatePlanUseCaseInput = CreatePlanDTO;

export type CreatePlanUseCaseOutput = Either<ValidationError, PlanDTO>;
