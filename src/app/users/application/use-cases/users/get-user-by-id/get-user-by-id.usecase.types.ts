import { Either } from "ts-arch-kit/dist/core/helpers";
import { PrimaryKey } from "ts-arch-kit/dist/core/models";

import { MissingParamError, NotFoundModelError } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type GetUserByIdUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type GetUserByIdUseCaseInput = {
    id: PrimaryKey;
};

export type GetUserByIdUseCaseOutput = Either<MissingParamError | NotFoundModelError, User>;
