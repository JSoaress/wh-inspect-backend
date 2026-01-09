import { Either } from "ts-arch-kit/dist/core/helpers";
import { PrimaryKey } from "ts-arch-kit/dist/core/models";

import { NotFoundModelError, UnknownError } from "@/app/_common";
import { IRepositoryFactory } from "@/infra/database";
import { IMail } from "@/infra/providers/mail";

export type SendUserActivationEmailUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    mail: IMail;
};

export type SendUserActivationEmailUseCaseInput = {
    userId: PrimaryKey;
};

export type SendUserActivationEmailUseCaseOutput = Either<NotFoundModelError | UnknownError, void>;
