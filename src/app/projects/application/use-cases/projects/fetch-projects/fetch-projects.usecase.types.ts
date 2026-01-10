import { BasicError } from "ts-arch-kit/dist/core/errors";
import { Either } from "ts-arch-kit/dist/core/helpers";
import { QueryOptions } from "ts-arch-kit/dist/database";

import { Pagination } from "@/app/_common";
import { DetailedProjectDTO } from "@/app/projects/domain/models/project";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IAppConfig } from "@/infra/config/app";
import { IRepositoryFactory } from "@/infra/database";

export type FetchProjectsUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    appConfig: IAppConfig;
};

export type FetchProjectsUseCaseInput = {
    queryOptions?: QueryOptions;
    requestUser: AuthenticatedUserDTO;
};

export type FetchProjectsUseCaseOutput = Either<BasicError, Pagination<DetailedProjectDTO>>;
