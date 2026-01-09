import { Either, left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, RequestLimitExceededError, UseCase } from "@/app/_common";
import { ProjectDTO } from "@/app/projects/domain/models/project";
import { WebHookLogEntityFactory } from "@/app/projects/domain/models/webhook";
import { ICacheProvider } from "@/infra/providers/cache";
import { IQueue } from "@/infra/queue";

import { IProjectRepository, IProjectUsageRepository, IWebhookLogRepository } from "../../../repos";
import {
    ReceiveWebhookUseCaseGateway,
    ReceiveWebhookUseCaseInput,
    ReceiveWebhookUseCaseOutput,
} from "./receive-webhook.usecase.types";

export class ReceiveWebhookUseCase extends UseCase<ReceiveWebhookUseCaseInput, ReceiveWebhookUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private projectUsageRepository: IProjectUsageRepository;
    private webhookLogRepository: IWebhookLogRepository;
    private cache: ICacheProvider;
    private queue: IQueue;

    constructor({ repositoryFactory, cache, queue }: ReceiveWebhookUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.projectUsageRepository = repositoryFactory.createProjectUsageRepository();
        this.webhookLogRepository = repositoryFactory.createWebhookLogRepository();
        this.unitOfWork.prepare(this.projectRepository, this.projectUsageRepository, this.webhookLogRepository);
        this.cache = cache;
        this.queue = queue;
    }

    protected async impl({ requestUser, ...input }: ReceiveWebhookUseCaseInput): Promise<ReceiveWebhookUseCaseOutput> {
        const result = await this.unitOfWork.execute<ReceiveWebhookUseCaseOutput>(async () => {
            const project = await this.projectRepository.findOne({ filter: { slug: input.projectSlug } });
            if (!project || !project.members.includes(`${requestUser.id}`))
                return left(new NotFoundModelError("Project", { slug: input.projectSlug }));
            const projectRateOrError = await this.checkProjectRate(project);
            if (projectRateOrError.isLeft()) return left(projectRateOrError.value);
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

    private async checkProjectRate(project: ProjectDTO): Promise<Either<RequestLimitExceededError, void>> {
        const cacheKey = `webhook:rate:${project.id}`;
        const count = await this.cache.increment(cacheKey, { ttl: 60 });
        if (count > 300) return left(new RequestLimitExceededError());
        return right(undefined);
    }

    private async checkIfOutOfSubscription(project: ProjectDTO): Promise<boolean> {
        const today = new Date();
        const yearMonth = `${today.getFullYear()}/${today.getMonth() + 1}`;
        const projectUsage = await this.projectUsageRepository.findOne({
            filter: { projectId: `${project.id}`, yearMonth },
        });
        return projectUsage ? !projectUsage.canReceiveEvent() : true;
    }
}
