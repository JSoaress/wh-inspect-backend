import { Either } from "ts-arch-kit/dist/core/helpers";

import { InvalidCredentialsError, InvalidPasswordError, InvalidTokenError, InvalidUserError } from "@/app/_common";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type ChangePasswordUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type ChangePasswordUseCaseInput = {
    currentPassword: string;
    newPassword: string;
    requestUser: AuthenticatedUserDTO;
};

export type ChangePasswordUseCaseOutput = Either<
    InvalidUserError | InvalidTokenError | InvalidPasswordError | InvalidCredentialsError,
    void
>;
