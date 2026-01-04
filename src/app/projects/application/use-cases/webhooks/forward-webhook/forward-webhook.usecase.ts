import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";
import { IWebSocket } from "@/infra/adapters/ws";

import { IProjectRepository, IWebhookLogRepository } from "../../../repos";
import {
    ForwardWebhookUseCaseGateway,
    ForwardWebhookUseCaseInput,
    ForwardWebhookUseCaseOutput,
} from "./forward-webhook.usecase.types";

export class ForwardWebhookUseCase extends UseCase<ForwardWebhookUseCaseInput, ForwardWebhookUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private webhookLogRepository: IWebhookLogRepository;
    private ws: IWebSocket;

    constructor({ repositoryFactory, ws }: ForwardWebhookUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.webhookLogRepository = repositoryFactory.createWebhookLogRepository();
        this.unitOfWork.prepare(this.projectRepository, this.webhookLogRepository);
        this.ws = ws;
    }

    protected async impl({ webhookLogId, requestUser }: ForwardWebhookUseCaseInput): Promise<ForwardWebhookUseCaseOutput> {
        return this.unitOfWork.execute<ForwardWebhookUseCaseOutput>(async () => {
            const webhookLog = await this.webhookLogRepository.findById(webhookLogId);
            if (!webhookLog) return left(new NotFoundModelError("WebhookLog", webhookLogId));
            const project = await this.projectRepository.findOne({ filter: { id: webhookLog.projectId } });
            if (!project || !project.members.includes(`${requestUser.id}`))
                return left(new NotFoundModelError("Project", webhookLog.projectId));
            const [simplifiedWebhook] = await this.webhookLogRepository.findSimplified({ filter: { id: webhookLogId } });
            this.ws.broadcast("front", requestUser.cliToken, simplifiedWebhook);
            this.ws.broadcast("cli", requestUser.cliToken, { ...webhookLog, projectSlug: project.slug });
            return right(undefined);
        });
    }
}
