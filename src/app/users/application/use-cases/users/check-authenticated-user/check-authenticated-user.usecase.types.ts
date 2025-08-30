import { Either } from "ts-arch-kit/dist/core/helpers";

import { InvalidTokenError, InvalidUserError, MissingParamError, NotFoundModelError } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";
import { JsonWebToken } from "@/infra/adapters/jwt";
import { IRepositoryFactory } from "@/infra/database";

export type CheckAuthenticatedUserUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    jwt: JsonWebToken;
};

export type CheckAuthenticatedUserUseCaseInput = {
    token: string;
};

export type CheckAuthenticatedUserUseCaseOutput = Either<
    MissingParamError | InvalidTokenError | NotFoundModelError | InvalidUserError,
    User
>;
