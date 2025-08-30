import { BasicError } from "ts-arch-kit/dist/core/errors";
import { Either } from "ts-arch-kit/dist/core/helpers";
import { QueryOptions } from "ts-arch-kit/dist/database";

import { Pagination } from "@/app/_common";
import { PlanDTO } from "@/app/subscription/domain/models/plan";
import { IRepositoryFactory } from "@/infra/database";

export type FetchPlansUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type FetchPlansUseCaseInput = {
    queryOptions?: QueryOptions;
};

export type FetchPlansUseCaseOutput = Either<BasicError, Pagination<PlanDTO>>;
