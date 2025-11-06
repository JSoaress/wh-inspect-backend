import { Either } from "ts-arch-kit/dist/core/helpers";

import { InvalidUserError, NotFoundModelError } from "@/app/_common";
import { IRepositoryFactory } from "@/infra/database";
import { IMail } from "@/infra/providers/mail";

export type SendEmailForPasswordRecoveryUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    mail: IMail;
};

export type SendEmailForPasswordRecoveryUseCaseInput = {
    email: string;
};

export type SendEmailForPasswordRecoveryUseCaseOutput = Either<NotFoundModelError | InvalidUserError, void>;
