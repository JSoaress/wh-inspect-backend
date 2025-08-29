import { Either } from "ts-arch-kit/dist/core/helpers";

import { ConflictError, ValidationError } from "@/app/_common";
import { CreateProjectDTO, ProjectDTO } from "@/app/projects/domain/models/project/project.dto";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type CreateProjectUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type CreateProjectUseCaseInput = Omit<CreateProjectDTO, "owner"> & {
    requestUser: User;
};

export type CreateProjectUseCaseOutput = Either<ValidationError | ConflictError, ProjectDTO>;
