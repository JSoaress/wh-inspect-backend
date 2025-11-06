import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";
import { Plan, PlanEntityFactory } from "@/app/subscription/domain/models/plan";

import { IPlanRepository } from "../../../repos";
import { UpdatePlanUseCaseGateway, UpdatePlanUseCaseInput, UpdatePlanUseCaseOutput } from "./update-plan.usecase.types";

export class UpdatePlanUseCase extends UseCase<UpdatePlanUseCaseInput, UpdatePlanUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private planRepository: IPlanRepository;

    constructor({ repositoryFactory }: UpdatePlanUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.planRepository = repositoryFactory.createPlanRepository();
        this.unitOfWork.prepare(this.planRepository);
    }

    protected impl({ id, ...input }: UpdatePlanUseCaseInput): Promise<UpdatePlanUseCaseOutput> {
        return this.unitOfWork.execute<UpdatePlanUseCaseOutput>(async () => {
            const plan = await this.planRepository.findById(id);
            if (!plan) return left(new NotFoundModelError(Plan.name, id));
            const updateOrError = PlanEntityFactory.update(plan, input);
            if (updateOrError.isLeft()) return left(updateOrError.value);
            const updatedPlan = await this.planRepository.save(plan);
            return right(updatedPlan);
        });
    }
}
