import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { ConflictError, UseCase } from "@/app/_common";
import { ProjectEntityFactory } from "@/app/projects/domain/models/project";
import { IAppConfig } from "@/infra/config/app";

import { IProjectRepository } from "../../../repos";
import {
    CreateProjectUseCaseGateway,
    CreateProjectUseCaseInput,
    CreateProjectUseCaseOutput,
} from "./create-project.usecase.types";

export class CreateProjectUseCase extends UseCase<CreateProjectUseCaseInput, CreateProjectUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private appConfig: IAppConfig;

    constructor({ repositoryFactory, appConfig }: CreateProjectUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.unitOfWork.prepare(this.projectRepository);
        this.appConfig = appConfig;
    }

    protected async impl({ requestUser, ...input }: CreateProjectUseCaseInput): Promise<CreateProjectUseCaseOutput> {
        return this.unitOfWork.execute<CreateProjectUseCaseOutput>(async () => {
            const projectOrError = ProjectEntityFactory.create({
                ...input,
                sourceSubscription: `${requestUser.currentSubscriptionId}`,
                owner: `${requestUser.id}`,
            });
            if (projectOrError.isLeft()) return left(projectOrError.value);
            const projectCreated = projectOrError.value;
            const slugInUse = await this.projectRepository.exists({
                slug: projectCreated.slug,
                owner: projectCreated.owner,
            });
            if (slugInUse)
                return left(new ConflictError(`Você já possui outro projeto utilizando a slug "${projectCreated.slug}".`));
            const savedProject = await this.projectRepository.save(projectCreated);
            return right({
                ...savedProject,
                publicUrl: `${this.appConfig.SELF_URL}api/webhooks/in/${requestUser.username}/${savedProject.slug}`,
            });
        });
    }
}
