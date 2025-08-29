import { Either } from "ts-arch-kit/dist/core/helpers";

import { NotFoundModelError, ValidationError } from "@/app/_common";
import { CreateWebHookLogDTO, WebHookLogDTO } from "@/app/projects/domain/models/webhook";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

import { ForwardWebhookUseCase } from "../forward-webhook/forward-webhook.usecase";

export type ReceiveWebhookUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    forwardWebhookUseCase: ForwardWebhookUseCase;
};

export type ReceiveWebhookUseCaseInput = Omit<CreateWebHookLogDTO, "projectId" | "receivedAt"> & {
    projectSlug: string;
    requestUser: User;
};

export type ReceiveWebhookUseCaseOutput = Either<ValidationError | NotFoundModelError, WebHookLogDTO>;
