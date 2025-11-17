import { Either } from "ts-arch-kit/dist/core/helpers";
import { QueryOptions } from "ts-arch-kit/dist/database";

import { NotFoundModelError, Pagination } from "@/app/_common";
import { SimplifiedWebhook } from "@/app/projects/domain/models/webhook";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type FetchSimplifiedWebhooksUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type FetchSimplifiedWebhooksUseCaseInput = {
    projectId: string;
    queryOptions: QueryOptions;
    requestUser: AuthenticatedUserDTO;
};

export type FetchSimplifiedWebhooksUseCaseOutput = Either<NotFoundModelError, Pagination<SimplifiedWebhook>>;
