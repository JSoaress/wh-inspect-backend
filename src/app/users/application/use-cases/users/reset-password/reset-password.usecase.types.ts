import { Either } from "ts-arch-kit/dist/core/helpers";

import { InvalidPasswordError, InvalidTokenError, InvalidUserError, NotFoundModelError } from "@/app/_common";
import { IRepositoryFactory } from "@/infra/database";
import { IPasswordPolicyProvider } from "@/infra/providers/password";

export type ResetPasswordUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    passwordPolicyProvider: IPasswordPolicyProvider;
};

export type ResetPasswordUseCaseInput = {
    token: string;
    newPassword: string;
};

export type ResetPasswordUseCaseOutput = Either<
    NotFoundModelError | InvalidUserError | InvalidTokenError | InvalidPasswordError,
    void
>;
