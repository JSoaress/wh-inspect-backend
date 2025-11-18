import { Either } from "ts-arch-kit/dist/core/helpers";

import { InvalidUserError, UnknownError } from "@/app/_common";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IWebSocket } from "@/infra/adapters/ws";
import { IRepositoryFactory } from "@/infra/database";

export type ChangeUserCliTokenUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    ws: IWebSocket;
};

export type ChangeUserCliTokenUseCaseInput = {
    requestUser: AuthenticatedUserDTO;
};

export type ChangeUserCliTokenUseCaseOutput = Either<InvalidUserError | UnknownError, { newCliToken: string }>;
