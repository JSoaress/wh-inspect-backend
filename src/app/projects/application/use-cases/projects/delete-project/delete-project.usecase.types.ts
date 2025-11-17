import { Either } from "ts-arch-kit/dist/core/helpers";
import { PrimaryKey } from "ts-arch-kit/dist/core/models";

import { NotFoundModelError } from "@/app/_common";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type DeleteProjectUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type DeleteProjectUseCaseInput = {
    id: PrimaryKey;
    requestUser: AuthenticatedUserDTO;
};

export type DeleteProjectUseCaseOutput = Either<NotFoundModelError, void>;
