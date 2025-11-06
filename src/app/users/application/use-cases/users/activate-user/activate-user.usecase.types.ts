import { Either } from "ts-arch-kit/dist/core/helpers";

import {
    InvalidTokenError,
    MissingParamError,
    NotFoundModelError,
    SystemParameterNotConfiguredError,
    UndefinedFreemiumPlanError,
    ValidationError,
} from "@/app/_common";
import { IRepositoryFactory } from "@/infra/database";

export type ActivateUserUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type ActivateUserUseCaseInput = {
    token: string;
};

export type ActivateUserUseCaseOutput = Either<
    | MissingParamError
    | NotFoundModelError
    | InvalidTokenError
    | UndefinedFreemiumPlanError
    | SystemParameterNotConfiguredError
    | ValidationError,
    void
>;
