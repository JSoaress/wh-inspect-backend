import { Either } from "ts-arch-kit/dist/core/helpers";
import { PrimaryKey } from "ts-arch-kit/dist/core/models";

import { NotFoundModelError, ValidationError } from "@/app/_common";
import { ProjectDTO, UpdateProjectDTO } from "@/app/projects/domain/models/project";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type UpdateProjectUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type UpdateProjectUseCaseInput = UpdateProjectDTO & {
    id: PrimaryKey;
    requestUser: User;
};

export type UpdateProjectUseCaseOutput = Either<NotFoundModelError | ValidationError, ProjectDTO>;
