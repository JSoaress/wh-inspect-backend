import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";
import { WebhookUsageEntityFactory } from "@/app/projects/domain/models/webhook-usage";
import { ISubscriptionRepository } from "@/app/subscription/application/repos";
import { Subscription } from "@/app/subscription/domain/models/subscription";
import { IUserRepository } from "@/app/users/application/repos";
import { User } from "@/app/users/domain/models/user";

import { IProjectRepository, IWebhookUsageRepository } from "../../../repos";
import {
    RegisterReceivedWebhookUseCaseInput,
    RegisterReceivedWebhookUseCaseOutput,
    RegisterReceivedWebhookUseCaseGateway,
} from "./register-received-webhook.usecase.types";

export class RegisterReceivedWebhookUseCase extends UseCase<
    RegisterReceivedWebhookUseCaseInput,
    RegisterReceivedWebhookUseCaseOutput
> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private webhookUsageRepository: IWebhookUsageRepository;
    private userRepository: IUserRepository;
    private subscriptionRepository: ISubscriptionRepository;

    constructor({ repositoryFactory }: RegisterReceivedWebhookUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.webhookUsageRepository = repositoryFactory.createWebhookUsageRepository();
        this.userRepository = repositoryFactory.createUserRepository();
        this.subscriptionRepository = repositoryFactory.createSubscriptionRepository();
        this.unitOfWork.prepare(
            this.projectRepository,
            this.webhookUsageRepository,
            this.userRepository,
            this.subscriptionRepository
        );
    }

    protected impl(input: RegisterReceivedWebhookUseCaseInput): Promise<RegisterReceivedWebhookUseCaseOutput> {
        return this.unitOfWork.execute<RegisterReceivedWebhookUseCaseOutput>(async () => {
            const project = await this.projectRepository.findOne({ filter: { id: input.project } });
            if (!project) return left(new NotFoundModelError("Project", input.project));
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1;
            const yearMonth = `${year}/${month}`;
            let webhookUsage = await this.webhookUsageRepository.findOne({
                filter: { subscriber: project.owner, yearMonth },
            });
            if (!webhookUsage) {
                const projectOwner = (await this.userRepository.findById(project.owner)) as User;
                const currentSubscription = (await this.subscriptionRepository.getCurrentSubscriptionByUser(
                    projectOwner
                )) as Subscription;
                const webhookUsageOrError = WebhookUsageEntityFactory.create({
                    subscriber: projectOwner.getId(),
                    maxEvents: currentSubscription.eventsMonth,
                    year,
                    month,
                });
                if (webhookUsageOrError.isLeft()) return left(webhookUsageOrError.value);
                webhookUsage = webhookUsageOrError.value;
            }
            webhookUsage.count();
            await this.webhookUsageRepository.save(webhookUsage);
            return right(undefined);
        });
    }
}
