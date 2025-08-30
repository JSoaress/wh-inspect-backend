import { right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";

import { IPlanRepository } from "../../../repos";
import { FetchPlansUseCaseGateway, FetchPlansUseCaseInput, FetchPlansUseCaseOutput } from "./fetch-plans.usecase.types";

export class FetchPlansUseCase extends UseCase<FetchPlansUseCaseInput, FetchPlansUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private planRepository: IPlanRepository;

    constructor({ repositoryFactory }: FetchPlansUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.planRepository = repositoryFactory.createPlanRepository();
        this.unitOfWork.prepare(this.planRepository);
    }

    protected impl({ queryOptions }: FetchPlansUseCaseInput): Promise<FetchPlansUseCaseOutput> {
        return this.unitOfWork.execute<FetchPlansUseCaseOutput>(async () => {
            const count = await this.planRepository.count(queryOptions?.filter);
            const results = await this.planRepository.find(queryOptions);
            return right({ count, results });
        });
    }
}
