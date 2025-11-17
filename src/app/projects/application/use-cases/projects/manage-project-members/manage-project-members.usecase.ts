import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";
import { ProjectEntityFactory } from "@/app/projects/domain/models/project";
import { IUserRepository } from "@/app/users/application/repos";

import { IProjectRepository } from "../../../repos";
import {
    ManageProjectMembersUseCaseGateway,
    ManageProjectMembersUseCaseInput,
    ManageProjectMembersUseCaseOutput,
} from "./manage-project-members.usecase.types";

export class ManageProjectMembersUseCase extends UseCase<
    ManageProjectMembersUseCaseInput,
    ManageProjectMembersUseCaseOutput
> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private userRepository: IUserRepository;

    constructor({ repositoryFactory }: ManageProjectMembersUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.projectRepository, this.userRepository);
    }

    protected async impl({
        id,
        operations,
        requestUser,
    }: ManageProjectMembersUseCaseInput): Promise<ManageProjectMembersUseCaseOutput> {
        return this.unitOfWork.execute<ManageProjectMembersUseCaseOutput>(async () => {
            const project = await this.projectRepository.findOne({ filter: { id, owner: `${requestUser.id}` } });
            if (!project) return left(new NotFoundModelError("Project", id));
            const updatedMembers: string[] = project.members.filter(
                (m) =>
                    !operations
                        .filter((op) => op.action === "remove")
                        .map((op) => op.memberId)
                        .includes(m)
            );
            await Promise.all(
                operations
                    .filter((op) => op.action === "add")
                    .map(async (op) => {
                        const exists = await this.userRepository.exists({ id: op.memberId });
                        if (exists) updatedMembers.push(op.memberId);
                    })
            );
            const updateOrError = ProjectEntityFactory.update(project, { members: updatedMembers });
            if (updateOrError.isLeft()) return left(updateOrError.value);
            const updatedProject = await this.projectRepository.save(updateOrError.value);
            return right(updatedProject);
        });
    }
}
