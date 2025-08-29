import { Either } from "ts-arch-kit/dist/core/helpers";

import { EmailTakenError, ValidationError } from "@/app/_common";
import { CreateUserDTO, User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";
import { IMail } from "@/infra/providers/mail";

export type CreateUserUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    mail: IMail;
};

export type CreateUserUseCaseInput = CreateUserDTO;

export type CreateUserUseCaseOutput = Either<ValidationError | EmailTakenError, User>;
