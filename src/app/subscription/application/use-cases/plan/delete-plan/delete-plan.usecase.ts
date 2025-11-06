import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase, NotFoundModelError } from "@/app/_common";
import { Plan } from "@/app/subscription/domain/models/plan";

import { IPlanRepository } from "../../../repos";
import { DeletePlanUseCaseInput, DeletePlanUseCaseOutput, DeletePlanUseCaseGateway } from "./delete-plan.usecase.types";

export class DeletePlanUseCase extends UseCase<DeletePlanUseCaseInput, DeletePlanUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private planRepository: IPlanRepository;

    constructor({ repositoryFactory }: DeletePlanUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.planRepository = repositoryFactory.createPlanRepository();
        this.unitOfWork.prepare(this.planRepository);
    }

    protected impl({ id }: DeletePlanUseCaseInput): Promise<DeletePlanUseCaseOutput> {
        return this.unitOfWork.execute<DeletePlanUseCaseOutput>(async () => {
            const plan = await this.planRepository.findById(id);
            if (!plan) return left(new NotFoundModelError(Plan.name, id));
            await this.planRepository.destroy(plan);
            return right(undefined);
        });
    }
}
