import { Either } from "ts-arch-kit/dist/core/helpers";

import { UnknownError } from "@/app/_common";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type GetWebhookMetricsUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type GetWebhookMetricsUseCaseInput = {
    requestUser: AuthenticatedUserDTO;
};

type Output = {
    success: number;
    failed: number;
};

export type GetWebhookMetricsUseCaseOutput = Either<UnknownError, Output>;
