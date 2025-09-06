import { Either } from "ts-arch-kit/dist/core/helpers";
import { PrimaryKey } from "ts-arch-kit/dist/core/models";

import { NotFoundModelError, ValidationError } from "@/app/_common";
import { ProjectDTO } from "@/app/projects/domain/models/project";
import { User } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type ManageProjectMembersUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type ManageProjectMembersUseCaseInput = {
    id: PrimaryKey;
    operations: {
        action: "add" | "remove";
        memberId: string;
    }[];
    requestUser: User;
};

export type ManageProjectMembersUseCaseOutput = Either<NotFoundModelError | ValidationError, ProjectDTO>;
