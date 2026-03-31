import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";
import { ProjectDTO } from "@/app/projects/domain/models/project";
import { WebHookLogEntityFactory } from "@/app/projects/domain/models/webhook";
import { IQueue } from "@/infra/queue";

import { IProjectRepository, IWebhookLogRepository, IWebhookUsageRepository } from "../../../repos";
import { SaveWebhookUseCaseInput, SaveWebhookUseCaseOutput, SaveWebhookUseCaseGateway } from "./save-webhook.usecase.types";

export class SaveWebhookUseCase extends UseCase<SaveWebhookUseCaseInput, SaveWebhookUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private webhookUsageRepository: IWebhookUsageRepository;
    private webhookLogRepository: IWebhookLogRepository;
    private queue: IQueue;

    constructor({ repositoryFactory, queue }: SaveWebhookUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.webhookUsageRepository = repositoryFactory.createWebhookUsageRepository();
        this.webhookLogRepository = repositoryFactory.createWebhookLogRepository();
        this.unitOfWork.prepare(this.projectRepository, this.webhookUsageRepository, this.webhookLogRepository);
        this.queue = queue;
    }

    protected async impl({ requestUser, ...input }: SaveWebhookUseCaseInput): Promise<SaveWebhookUseCaseOutput> {
        const result = await this.unitOfWork.execute<SaveWebhookUseCaseOutput>(async () => {
            const project = await this.projectRepository.findOne({ filter: { slug: input.projectSlug } });
            if (!project || !project.members.includes(`${requestUser.id}`))
                return left(new NotFoundModelError("Project", { slug: input.projectSlug }));
            const _outOfSubscription = await this.checkIfOutOfSubscription(project);
            const webhookLogOrError = WebHookLogEntityFactory.create({
                ...input,
                projectId: `${project.id}`,
                receivedAt: new Date(),
                sourceSubscription: `${requestUser.currentSubscriptionId}`,
                _outOfSubscription,
            });
            if (webhookLogOrError.isLeft()) return left(webhookLogOrError.value);
            const createdWebhookLog = webhookLogOrError.value;
            const savedWebhookLog = await this.webhookLogRepository.save(createdWebhookLog);
            return right(savedWebhookLog);
        });
        if (result.isRight()) {
            await this.queue.publish("forwardWebhook", { requestUser, webhookLogId: result.value.id });
            await this.queue.publish("registerReceivedWebhook", { project: result.value.projectId });
        }
        return result;
    }

    private async checkIfOutOfSubscription(project: ProjectDTO): Promise<boolean> {
        const today = new Date();
        const yearMonth = `${today.getFullYear()}/${today.getMonth() + 1}`;
        const projectUsage = await this.webhookUsageRepository.findOne({
            filter: { subscriber: `${project.owner}`, yearMonth },
        });
        if (!projectUsage) return false;
        return !projectUsage.canReceiveEvent();
    }
}
