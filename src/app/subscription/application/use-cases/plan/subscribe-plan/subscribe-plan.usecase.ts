import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";
import { Plan } from "@/app/subscription/domain/models/plan";

import { IPlanRepository, ISubscriptionRepository } from "../../../repos";
import {
    SubscribePlanUseCaseGateway,
    SubscribePlanUseCaseInput,
    SubscribePlanUseCaseOutput,
} from "./subscribe-plan.usecase.types";

export class SubscribePlanUseCase extends UseCase<SubscribePlanUseCaseInput, SubscribePlanUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private planRepository: IPlanRepository;
    private subscriptionRepository: ISubscriptionRepository;

    constructor({ repositoryFactory }: SubscribePlanUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.planRepository = repositoryFactory.createPlanRepository();
        this.subscriptionRepository = repositoryFactory.createSubscriptionRepository();
        this.unitOfWork.prepare(this.planRepository, this.subscriptionRepository);
    }

    protected async impl({ requestUser, ...input }: SubscribePlanUseCaseInput): Promise<SubscribePlanUseCaseOutput> {
        return this.unitOfWork.execute<SubscribePlanUseCaseOutput>(async () => {
            const plan = await this.planRepository.findById(input.selectedPlanId);
            if (!plan) return left(new NotFoundModelError(Plan.name, input.selectedPlanId));
            const currentSubscription = await this.subscriptionRepository.findOne({
                filter: { userId: requestUser.getId(), endDate: { $isNull: true } },
            });
            if (currentSubscription) {
                currentSubscription.finish();
                await this.subscriptionRepository.save(currentSubscription);
            }
            const subscriptionOrError = plan.subscribe(requestUser, input.paymentMethod);
            if (subscriptionOrError.isLeft()) return left(subscriptionOrError.value);
            const newSubscription = await this.subscriptionRepository.save(subscriptionOrError.value);
            return right(newSubscription);
        });
    }
}
