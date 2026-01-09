import { Either } from "ts-arch-kit/dist/core/helpers";

import { NotFoundModelError, RequestLimitExceededError, ValidationError } from "@/app/_common";
import { CreateWebHookLogDTO, WebHookLogDTO } from "@/app/projects/domain/models/webhook";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";
import { ICacheProvider } from "@/infra/providers/cache";
import { IQueue } from "@/infra/queue";

export type ReceiveWebhookUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    cache: ICacheProvider;
    queue: IQueue;
};

export type ReceiveWebhookUseCaseInput = Omit<CreateWebHookLogDTO, "projectId" | "receivedAt" | "sourceSubscription"> & {
    projectSlug: string;
    requestUser: AuthenticatedUserDTO;
};

export type ReceiveWebhookUseCaseOutput = Either<
    ValidationError | NotFoundModelError | RequestLimitExceededError,
    WebHookLogDTO
>;
