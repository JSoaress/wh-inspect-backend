import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";

import { IProjectRepository, IWebhookLogRepository } from "../../../repos";
import { GetWebhookUseCaseGateway, GetWebhookUseCaseInput, GetWebhookUseCaseOutput } from "./get-webhook.usecase.types";

export class GetWebhookUseCase extends UseCase<GetWebhookUseCaseInput, GetWebhookUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private webhookLogRepository: IWebhookLogRepository;

    constructor({ repositoryFactory }: GetWebhookUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.webhookLogRepository = repositoryFactory.createWebhookLogRepository();
        this.unitOfWork.prepare(this.projectRepository, this.webhookLogRepository);
    }

    protected impl({ queryOptions, requestUser }: GetWebhookUseCaseInput): Promise<GetWebhookUseCaseOutput> {
        return this.unitOfWork.execute<GetWebhookUseCaseOutput>(async () => {
            const projects = await this.projectRepository.find({ filter: { owner: requestUser.id as string } });
            const projectIds = projects.map((project) => project.id as string);
            const webhook = await this.webhookLogRepository.findOne({
                ...queryOptions,
                filter: {
                    ...queryOptions?.filter,
                    projectId: { $in: projectIds },
                },
            });
            if (!webhook) return left(new NotFoundModelError("Webhook", queryOptions?.filter));
            return right(webhook);
        });
    }
}
