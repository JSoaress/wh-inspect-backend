import { Either } from "ts-arch-kit/dist/core/helpers";

import { ValidationError, NotFoundModelError } from "@/app/_common";
import { CreateWebHookLogDTO, WebHookLogDTO } from "@/app/projects/domain/models/webhook";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";
import { IQueue } from "@/infra/queue";

export type SaveWebhookUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    queue: IQueue;
};

export type SaveWebhookUseCaseInput = Omit<CreateWebHookLogDTO, "projectId" | "receivedAt" | "sourceSubscription"> & {
    projectSlug: string;
    requestUser: AuthenticatedUserDTO;
};

export type SaveWebhookUseCaseOutput = Either<ValidationError | NotFoundModelError, WebHookLogDTO>;
