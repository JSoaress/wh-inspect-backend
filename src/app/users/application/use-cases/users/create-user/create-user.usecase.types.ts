import { Either } from "ts-arch-kit/dist/core/helpers";

import { EmailTakenError, UsernameTakenError, ValidationError } from "@/app/_common";
import { CreateUserDTO, User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";
import { IQueue } from "@/infra/queue";

export type CreateUserUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    queue: IQueue;
};

export type CreateUserUseCaseInput = CreateUserDTO;

export type CreateUserUseCaseOutput = Either<ValidationError | EmailTakenError | UsernameTakenError, User>;
