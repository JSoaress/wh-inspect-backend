import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";

import { IProjectRepository, IWebhookLogRepository } from "../../../repos";
import {
    FetchSimplifiedWebhooksUseCaseGateway,
    FetchSimplifiedWebhooksUseCaseInput,
    FetchSimplifiedWebhooksUseCaseOutput,
} from "./fetch-simplified-webhooks.usecase.types";

export class FetchSimplifiedWebhooksUseCase extends UseCase<
    FetchSimplifiedWebhooksUseCaseInput,
    FetchSimplifiedWebhooksUseCaseOutput
> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private webhookRepository: IWebhookLogRepository;

    constructor({ repositoryFactory }: FetchSimplifiedWebhooksUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.webhookRepository = repositoryFactory.createWebhookLogRepository();
        this.unitOfWork.prepare(this.projectRepository, this.webhookRepository);
    }

    protected async impl(input: FetchSimplifiedWebhooksUseCaseInput): Promise<FetchSimplifiedWebhooksUseCaseOutput> {
        return this.unitOfWork.execute<FetchSimplifiedWebhooksUseCaseOutput>(async () => {
            const { queryOptions, requestUser, projectId } = input;
            const project = await this.projectRepository.findById(projectId);
            if (!project || !project.members.includes(requestUser.getId()))
                return left(new NotFoundModelError("Project", projectId));
            const { filter = {}, ...qo } = queryOptions;
            filter.projectId = projectId;
            const count = await this.webhookRepository.count(filter);
            const webhooks = await this.webhookRepository.findSimplified({ ...qo, filter });
            return right({ count, results: webhooks });
        });
    }
}
