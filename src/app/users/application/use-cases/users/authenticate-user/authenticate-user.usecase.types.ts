import { Either } from "ts-arch-kit/dist/core/helpers";

import { InvalidCredentialsError, InvalidUserError, MissingParamError } from "@/app/_common";
import { UserDTO } from "@/app/users/domain/models/user";
import { JsonWebToken } from "@/infra/adapters/jwt";
import { IRepositoryFactory } from "@/infra/database";

export type AuthenticateUserUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    jwt: JsonWebToken;
};

export type AuthenticateUserUseCaseInput = {
    login: string;
    password: string;
};

type AuthenticatedUser = {
    accessToken: string;
    user: Pick<UserDTO, "id" | "name" | "username" | "email" | "cliToken" | "lastLogin" | "isActive"> & {
        firstAccess: boolean;
    };
};

export type AuthenticateUserUseCaseOutput = Either<
    MissingParamError | InvalidCredentialsError | InvalidUserError,
    AuthenticatedUser
>;
