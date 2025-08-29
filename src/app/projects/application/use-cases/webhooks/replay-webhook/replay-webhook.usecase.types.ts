import { Either } from "ts-arch-kit/dist/core/helpers";
import { PrimaryKey } from "ts-arch-kit/dist/core/models";

import { NotFoundModelError, ValidationError } from "@/app/_common";
import { CreateWebHookLogDTO, WebHookLogDTO } from "@/app/projects/domain/models/webhook";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

import { ForwardWebhookUseCase } from "../forward-webhook/forward-webhook.usecase";

export type ReplayWebhookUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    forwardWebhookUseCase: ForwardWebhookUseCase;
};

export type ReplayWebhookUseCaseInput = Partial<Pick<CreateWebHookLogDTO, "body" | "headers">> & {
    webhookLogId: PrimaryKey;
    requestUser: User;
};

export type ReplayWebhookUseCaseOutput = Either<ValidationError | NotFoundModelError, WebHookLogDTO>;
