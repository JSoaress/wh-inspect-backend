import { Either } from "ts-arch-kit/dist/core/helpers";

import { NotFoundModelError, RequestLimitExceededError, ValidationError } from "@/app/_common";
import { CreateWebHookLogDTO, WebHookLogDTO } from "@/app/projects/domain/models/webhook";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";
import { ICacheProvider } from "@/infra/providers/cache";

import { ForwardWebhookUseCase } from "../forward-webhook/forward-webhook.usecase";

export type ReceiveWebhookUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    forwardWebhookUseCase: ForwardWebhookUseCase;
    cache: ICacheProvider;
};

export type ReceiveWebhookUseCaseInput = Omit<CreateWebHookLogDTO, "projectId" | "receivedAt" | "sourceSubscription"> & {
    projectSlug: string;
    requestUser: AuthenticatedUserDTO;
};

export type ReceiveWebhookUseCaseOutput = Either<
    ValidationError | NotFoundModelError | RequestLimitExceededError,
    WebHookLogDTO
>;
