import { right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";

import { IProjectRepository, IWebhookLogRepository } from "../../../repos";
import {
    GetWebhookMetricsUseCaseGateway,
    GetWebhookMetricsUseCaseInput,
    GetWebhookMetricsUseCaseOutput,
} from "./get-webhook-metrics.usecase.types";

export class GetWebhookMetricsUseCase extends UseCase<GetWebhookMetricsUseCaseInput, GetWebhookMetricsUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private webhookLogRepository: IWebhookLogRepository;

    constructor({ repositoryFactory }: GetWebhookMetricsUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.webhookLogRepository = repositoryFactory.createWebhookLogRepository();
        this.unitOfWork.prepare(this.projectRepository, this.webhookLogRepository);
    }

    protected async impl({ requestUser }: GetWebhookMetricsUseCaseInput): Promise<GetWebhookMetricsUseCaseOutput> {
        return this.unitOfWork.execute<GetWebhookMetricsUseCaseOutput>(async () => {
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const projects = await this.projectRepository.find({ filter: { owner: requestUser.id as string } });
            const projectIds = projects.map((project) => project.id as string);
            const success = await this.webhookLogRepository.count({
                projectId: { $in: projectIds },
                receivedAt: { $range: { start: startDate, end: now } },
            });
            return right({ success, failed: 0 });
        });
    }
}
