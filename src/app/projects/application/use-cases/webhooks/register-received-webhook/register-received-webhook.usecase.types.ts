import { Either } from "ts-arch-kit/dist/core/helpers";
import { PrimaryKey } from "ts-arch-kit/dist/core/models";

import { NotFoundModelError, UnknownError, ValidationError } from "@/app/_common";
import { IRepositoryFactory } from "@/infra/database";

export type RegisterReceivedWebhookUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type RegisterReceivedWebhookUseCaseInput = {
    project: PrimaryKey;
};

export type RegisterReceivedWebhookUseCaseOutput = Either<ValidationError | NotFoundModelError | UnknownError, void>;
