import { Either } from "ts-arch-kit/dist/core/helpers";
import { PrimaryKey } from "ts-arch-kit/dist/core/models";

import { NotFoundModelError, ValidationError } from "@/app/_common";
import { IRepositoryFactory } from "@/infra/database";

export type DeletePlanUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type DeletePlanUseCaseInput = {
    id: PrimaryKey;
};

export type DeletePlanUseCaseOutput = Either<NotFoundModelError | ValidationError, void>;
