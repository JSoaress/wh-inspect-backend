import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";

import { IProjectRepository, IWebhookLogRepository } from "../../../repos";
import {
    DeleteProjectUseCaseGateway,
    DeleteProjectUseCaseInput,
    DeleteProjectUseCaseOutput,
} from "./delete-project.usecase.types";

export class DeleteProjectUseCase extends UseCase<DeleteProjectUseCaseInput, DeleteProjectUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private webhookRepository: IWebhookLogRepository;

    constructor({ repositoryFactory }: DeleteProjectUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.webhookRepository = repositoryFactory.createWebhookLogRepository();
        this.unitOfWork.prepare(this.projectRepository, this.webhookRepository);
    }

    protected async impl({ id, requestUser }: DeleteProjectUseCaseInput): Promise<DeleteProjectUseCaseOutput> {
        return this.unitOfWork.execute<DeleteProjectUseCaseOutput>(async () => {
            const project = await this.projectRepository.findOne({ filter: { id, owner: `${requestUser.id}` } });
            if (!project) return left(new NotFoundModelError("Project", id));
            await this.webhookRepository.destroyByProject(project);
            await this.projectRepository.destroy(project);
            return right(undefined);
        });
    }
}
