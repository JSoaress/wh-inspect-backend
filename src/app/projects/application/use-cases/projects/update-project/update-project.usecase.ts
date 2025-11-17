import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";
import { ProjectEntityFactory } from "@/app/projects/domain/models/project";

import { IProjectRepository } from "../../../repos";
import {
    UpdateProjectUseCaseGateway,
    UpdateProjectUseCaseInput,
    UpdateProjectUseCaseOutput,
} from "./update-project.usecase.types";

export class UpdateProjectUseCase extends UseCase<UpdateProjectUseCaseInput, UpdateProjectUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;

    constructor({ repositoryFactory }: UpdateProjectUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.unitOfWork.prepare(this.projectRepository);
    }

    protected async impl({ requestUser, id, ...input }: UpdateProjectUseCaseInput): Promise<UpdateProjectUseCaseOutput> {
        return this.unitOfWork.execute<UpdateProjectUseCaseOutput>(async () => {
            const project = await this.projectRepository.findOne({ filter: { id, owner: `${requestUser.id}` } });
            if (!project) return left(new NotFoundModelError("Project", id));
            const updateOrError = ProjectEntityFactory.update(project, input);
            if (updateOrError.isLeft()) return left(updateOrError.value);
            const updatedProject = await this.projectRepository.save(updateOrError.value);
            return right(updatedProject);
        });
    }
}
