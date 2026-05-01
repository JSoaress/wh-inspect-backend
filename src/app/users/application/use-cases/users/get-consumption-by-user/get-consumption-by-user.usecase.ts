import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NoSubscriptionPlanError, UseCase } from "@/app/_common";
import { IProjectRepository, IWebhookUsageRepository } from "@/app/projects/application/repos";
import { ISubscriptionRepository } from "@/app/subscription/application/repos";
import { User } from "@/app/users/domain/models/user";

import {
    GetConsumptionByUserUseCaseGateway,
    GetConsumptionByUserUseCaseInput,
    GetConsumptionByUserUseCaseOutput,
} from "./get-consumption-by-user.usecase.types";

export class GetConsumptionByUserUseCase extends UseCase<
    GetConsumptionByUserUseCaseInput,
    GetConsumptionByUserUseCaseOutput
> {
    private unitOfWork: UnitOfWork;
    private subscriptionRepository: ISubscriptionRepository;
    private webhookUsageRepository: IWebhookUsageRepository;
    private projectsRepository: IProjectRepository;

    constructor({ repositoryFactory }: GetConsumptionByUserUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.subscriptionRepository = repositoryFactory.createSubscriptionRepository();
        this.webhookUsageRepository = repositoryFactory.createWebhookUsageRepository();
        this.projectsRepository = repositoryFactory.createProjectRepository();
        this.unitOfWork.prepare(this.subscriptionRepository, this.webhookUsageRepository, this.projectsRepository);
    }

    protected async impl({ requestUser }: GetConsumptionByUserUseCaseInput): Promise<GetConsumptionByUserUseCaseOutput> {
        return this.unitOfWork.execute<GetConsumptionByUserUseCaseOutput>(async () => {
            const restoredUser = User.restore(requestUser);
            const currentSubscription = await this.subscriptionRepository.getCurrentSubscriptionByUser(restoredUser);
            if (!currentSubscription) return left(new NoSubscriptionPlanError());
            const webhookUsage = await this.webhookUsageRepository.findOne({
                filter: { subscriber: `${requestUser.id}` },
                sort: [{ column: "id", order: "desc" }],
            });
            const projects = await this.projectsRepository.count({ owner: `${requestUser.id}` });
            const month = `${webhookUsage?.month}`.padStart(2, "0");
            const yearMonth = `${webhookUsage?.year}/${month}`;
            const consumption = {
                yearMonth,
                maxEvents: webhookUsage?.maxEvents || 0,
                eventsCount: webhookUsage?.eventsCount || 0,
                projects,
                maxProjects: currentSubscription.maxProjects,
            };
            return right(consumption);
        });
    }
}
