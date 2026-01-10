import { Either } from "ts-arch-kit/dist/core/helpers";

import { ConflictError, ValidationError } from "@/app/_common";
import { CreateProjectDTO, DetailedProjectDTO, ProjectDTO } from "@/app/projects/domain/models/project/project.dto";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IAppConfig } from "@/infra/config/app";
import { IRepositoryFactory } from "@/infra/database";

export type CreateProjectUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
    appConfig: IAppConfig;
};

export type CreateProjectUseCaseInput = Omit<CreateProjectDTO, "owner" | "sourceSubscription"> & {
    requestUser: AuthenticatedUserDTO;
};

type ProjectCreatedDTO = ProjectDTO & Pick<DetailedProjectDTO, "publicUrl">;

export type CreateProjectUseCaseOutput = Either<ValidationError | ConflictError, ProjectCreatedDTO>;
