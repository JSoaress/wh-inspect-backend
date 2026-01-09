import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";
import { WebHookLogEntityFactory } from "@/app/projects/domain/models/webhook";
import { IQueue } from "@/infra/queue";

import { IProjectRepository, IWebhookLogRepository } from "../../../repos";
import {
    ReplayWebhookUseCaseGateway,
    ReplayWebhookUseCaseInput,
    ReplayWebhookUseCaseOutput,
} from "./replay-webhook.usecase.types";

export class ReplayWebhookUseCase extends UseCase<ReplayWebhookUseCaseInput, ReplayWebhookUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private webhookLogRepository: IWebhookLogRepository;
    private queue: IQueue;

    constructor({ repositoryFactory, queue }: ReplayWebhookUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.webhookLogRepository = repositoryFactory.createWebhookLogRepository();
        this.unitOfWork.prepare(this.projectRepository, this.webhookLogRepository);
        this.queue = queue;
    }

    protected async impl({
        requestUser,
        webhookLogId,
        ...input
    }: ReplayWebhookUseCaseInput): Promise<ReplayWebhookUseCaseOutput> {
        const result = await this.unitOfWork.execute<ReplayWebhookUseCaseOutput>(async () => {
            const webhookLog = await this.webhookLogRepository.findById(webhookLogId);
            if (!webhookLog) return left(new NotFoundModelError("WebhookLog", webhookLogId));
            const project = await this.projectRepository.findOne({ filter: { id: webhookLog.projectId } });
            if (!project || !project.members.includes(`${requestUser.id}`))
                return left(new NotFoundModelError("Project", webhookLog.projectId));
            const webhookLogOrError = WebHookLogEntityFactory.create({
                ...webhookLog,
                headers: { ...webhookLog.headers, ...input.headers },
                body: { ...webhookLog.body, ...input.body },
                sourceSubscription: `${requestUser.currentSubscriptionId}`,
                replayedFrom: `${webhookLogId}`,
                replayedAt: new Date(),
                replayStatus: "success",
            });
            if (webhookLogOrError.isLeft()) return left(webhookLogOrError.value);
            const replayedWebhook = await this.webhookLogRepository.save(webhookLogOrError.value);
            return right(replayedWebhook);
        });
        if (result.isRight()) {
            await this.queue.publish("forwardWebhook", { requestUser, webhookLogId: result.value.id });
            await this.queue.publish("registerReceivedWebhook", { project: result.value.projectId });
        }
        return result;
    }
}
