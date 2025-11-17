import { Either } from "ts-arch-kit/dist/core/helpers";

import { ConflictError, ValidationError } from "@/app/_common";
import { CreateProjectDTO, ProjectDTO } from "@/app/projects/domain/models/project/project.dto";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type CreateProjectUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type CreateProjectUseCaseInput = Omit<CreateProjectDTO, "owner" | "sourceSubscription"> & {
    requestUser: AuthenticatedUserDTO;
};

export type CreateProjectUseCaseOutput = Either<ValidationError | ConflictError, ProjectDTO>;
