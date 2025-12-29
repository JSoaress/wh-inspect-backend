import { Either } from "ts-arch-kit/dist/core/helpers";

import { NotFoundModelError, UnknownError, ValidationError } from "@/app/_common";
import { AuthenticatedUserDTO, UpdateUserDTO, User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type UpdateUserUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type UpdateUserUseCaseInput = UpdateUserDTO & {
    requestUser: AuthenticatedUserDTO;
};

export type UpdateUserUseCaseOutput = Either<NotFoundModelError | ValidationError | UnknownError, User>;
