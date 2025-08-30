import { Either } from "ts-arch-kit/dist/core/helpers";
import { QueryOptions } from "ts-arch-kit/dist/database";

import { NotFoundModelError } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

import { UserWhereRepository } from "../../../repos";

export type GetUserUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type GetUserUseCaseInput = Required<Pick<QueryOptions<UserWhereRepository>, "filter">>;

export type GetUserUseCaseOutput = Either<NotFoundModelError, User>;
