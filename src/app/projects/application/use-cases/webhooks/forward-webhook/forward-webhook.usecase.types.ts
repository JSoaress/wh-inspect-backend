import { Either } from "ts-arch-kit/dist/core/helpers";
import { PrimaryKey } from "ts-arch-kit/dist/core/models";

import { NotFoundModelError } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";
import { IWebSocket } from "@/infra/adapters/ws";
import { IRepositoryFactory } from "@/infra/database";

export type ForwardWebhookUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    ws: IWebSocket;
};

export type ForwardWebhookUseCaseInput = {
    webhookLogId: PrimaryKey;
    requestUser: User;
};

export type ForwardWebhookUseCaseOutput = Either<NotFoundModelError, void>;
