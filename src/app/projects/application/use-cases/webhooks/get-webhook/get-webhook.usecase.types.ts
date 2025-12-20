import { Either } from "ts-arch-kit/dist/core/helpers";
import { QueryOptions } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UnknownError } from "@/app/_common";
import { WebHookLogDTO } from "@/app/projects/domain/models/webhook";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type GetWebhookUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type GetWebhookUseCaseInput = {
    queryOptions?: QueryOptions;
    requestUser: AuthenticatedUserDTO;
};

export type GetWebhookUseCaseOutput = Either<NotFoundModelError | UnknownError, WebHookLogDTO>;
