import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NoSubscriptionPlanError, UseCase } from "@/app/_common";

import { ISubscriptionRepository } from "../../../repos";
import {
    CheckSubscriptionConsumptionUseCaseGateway,
    CheckSubscriptionConsumptionUseCaseInput,
    CheckSubscriptionConsumptionUseCaseOutput,
} from "./check-subscription-consumption.usecase.types";

export class CheckSubscriptionConsumptionUseCase extends UseCase<
    CheckSubscriptionConsumptionUseCaseInput,
    CheckSubscriptionConsumptionUseCaseOutput
> {
    private unitOfWork: UnitOfWork;
    private subscriptionRepository: ISubscriptionRepository;

    constructor({ repositoryFactory }: CheckSubscriptionConsumptionUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.subscriptionRepository = repositoryFactory.createSubscriptionRepository();
        this.unitOfWork.prepare(this.subscriptionRepository);
    }

    protected impl(input: CheckSubscriptionConsumptionUseCaseInput): Promise<CheckSubscriptionConsumptionUseCaseOutput> {
        return this.unitOfWork.execute<CheckSubscriptionConsumptionUseCaseOutput>(async () => {
            const { action, requestUser } = input;
            const subscription = await this.subscriptionRepository.findOne({
                filter: { userId: requestUser.getId(), endDate: { $isNull: true } },
            });
            if (!subscription) return left(new NoSubscriptionPlanError());
            const consumption = await this.subscriptionRepository.getConsumptionByUser(requestUser);
            const canOrError = subscription.checkConsumption(action, consumption);
            if (canOrError.isLeft()) return left(canOrError.value);
            return right(canOrError.value);
        });
    }
}
