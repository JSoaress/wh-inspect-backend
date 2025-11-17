import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";
import { WebHookLogEntityFactory } from "@/app/projects/domain/models/webhook";

import { IProjectRepository, IWebhookLogRepository } from "../../../repos";
import { ForwardWebhookUseCase } from "../forward-webhook/forward-webhook.usecase";
import {
    ReceiveWebhookUseCaseGateway,
    ReceiveWebhookUseCaseInput,
    ReceiveWebhookUseCaseOutput,
} from "./receive-webhook.usecase.types";

export class ReceiveWebhookUseCase extends UseCase<ReceiveWebhookUseCaseInput, ReceiveWebhookUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private webhookLogRepository: IWebhookLogRepository;
    private forwardWebhookUseCase: ForwardWebhookUseCase;

    constructor({ repositoryFactory, forwardWebhookUseCase }: ReceiveWebhookUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.webhookLogRepository = repositoryFactory.createWebhookLogRepository();
        this.unitOfWork.prepare(this.projectRepository, this.webhookLogRepository);
        this.forwardWebhookUseCase = forwardWebhookUseCase;
    }

    protected async impl({ requestUser, ...input }: ReceiveWebhookUseCaseInput): Promise<ReceiveWebhookUseCaseOutput> {
        const result = await this.unitOfWork.execute<ReceiveWebhookUseCaseOutput>(async () => {
            const project = await this.projectRepository.findOne({ filter: { slug: input.projectSlug } });
            if (!project || !project.members.includes(`${requestUser.id}`))
                return left(new NotFoundModelError("Project", { slug: input.projectSlug }));
            const webhookLogOrError = WebHookLogEntityFactory.create({
                ...input,
                projectId: `${project.id}`,
                receivedAt: new Date(),
                sourceSubscription: `${requestUser.currentSubscriptionId}`,
            });
            if (webhookLogOrError.isLeft()) return left(webhookLogOrError.value);
            const createdWebhookLog = webhookLogOrError.value;
            const savedWebhookLog = await this.webhookLogRepository.save(createdWebhookLog);
            return right(savedWebhookLog);
        });
        if (result.isRight()) await this.forwardWebhookUseCase.execute({ requestUser, webhookLogId: result.value.id });
        return result;
    }
}
