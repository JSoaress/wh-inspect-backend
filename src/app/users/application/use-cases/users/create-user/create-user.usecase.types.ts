import { Either } from "ts-arch-kit/dist/core/helpers";

import { EmailTakenError, ValidationError } from "@/app/_common";
import { CreateUserDTO, User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type CreateUserUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type CreateUserUseCaseInput = CreateUserDTO;

export type CreateUserUseCaseOutput = Either<ValidationError | EmailTakenError, User>;
