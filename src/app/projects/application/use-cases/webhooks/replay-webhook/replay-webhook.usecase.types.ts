import { Either } from "ts-arch-kit/dist/core/helpers";
import { PrimaryKey } from "ts-arch-kit/dist/core/models";

import { NotFoundModelError, ValidationError } from "@/app/_common";
import { CreateWebHookLogDTO, WebHookLogDTO } from "@/app/projects/domain/models/webhook";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";
import { IQueue } from "@/infra/queue";

export type ReplayWebhookUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    queue: IQueue;
};

export type ReplayWebhookUseCaseInput = Partial<Pick<CreateWebHookLogDTO, "body" | "headers">> & {
    webhookLogId: PrimaryKey;
    requestUser: AuthenticatedUserDTO;
};

export type ReplayWebhookUseCaseOutput = Either<ValidationError | NotFoundModelError, WebHookLogDTO>;
