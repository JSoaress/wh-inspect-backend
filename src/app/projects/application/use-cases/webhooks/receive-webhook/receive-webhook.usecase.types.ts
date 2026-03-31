import { Either } from "ts-arch-kit/dist/core/helpers";

import { RequestLimitExceededError } from "@/app/_common";
import { CreateWebHookLogDTO } from "@/app/projects/domain/models/webhook";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { ICacheProvider } from "@/infra/providers/cache";
import { IQueue } from "@/infra/queue";

export type ReceiveWebhookUseCaseGateway = {
    cache: ICacheProvider;
    queue: IQueue;
};

export type ReceiveWebhookUseCaseInput = Omit<CreateWebHookLogDTO, "projectId" | "receivedAt" | "sourceSubscription"> & {
    projectSlug: string;
    requestUser: AuthenticatedUserDTO;
};

export type ReceiveWebhookUseCaseOutput = Either<RequestLimitExceededError, void>;
