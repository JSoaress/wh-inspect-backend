import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { PlanEntityFactory } from "@/app/subscription/domain/models/plan";

import { IPlanRepository } from "../../../repos";
import { CreatePlanUseCaseGateway, CreatePlanUseCaseInput, CreatePlanUseCaseOutput } from "./create-plan.usecase.types";

export class CreatePlanUseCase extends UseCase<CreatePlanUseCaseInput, CreatePlanUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private planRepository: IPlanRepository;

    constructor({ repositoryFactory }: CreatePlanUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.planRepository = repositoryFactory.createPlanRepository();
        this.unitOfWork.prepare(this.planRepository);
    }

    protected async impl(input: CreatePlanUseCaseInput): Promise<CreatePlanUseCaseOutput> {
        return this.unitOfWork.execute<CreatePlanUseCaseOutput>(async () => {
            const planOrError = PlanEntityFactory.create(input);
            if (planOrError.isLeft()) return left(planOrError.value);
            const savedPlan = await this.planRepository.save(planOrError.value);
            return right(savedPlan);
        });
    }
}
