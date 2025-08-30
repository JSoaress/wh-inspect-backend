import { Either } from "ts-arch-kit/dist/core/helpers";

import { InvalidCredentialsError, InvalidUserError, MissingParamError } from "@/app/_common";
import { UserDTO } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type AuthenticateUserUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type AuthenticateUserUseCaseInput = {
    email: string;
    password: string;
};

type AuthenticatedUser = {
    accessToken: string;
    user: Pick<UserDTO, "email" | "name" | "cliToken" | "isActive">;
};

export type AuthenticateUserUseCaseOutput = Either<
    MissingParamError | InvalidCredentialsError | InvalidUserError,
    AuthenticatedUser
>;
