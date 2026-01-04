import { right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";

import { IFeedbackRepository } from "../../../repos";
import {
    FetchFeedbacksUseCaseGateway,
    FetchFeedbacksUseCaseInput,
    FetchFeedbacksUseCaseOutput,
} from "./fetch-feedbacks.usecase.types";

export class FetchFeedbacksUseCase extends UseCase<FetchFeedbacksUseCaseInput, FetchFeedbacksUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private feedbackRepository: IFeedbackRepository;

    constructor({ repositoryFactory }: FetchFeedbacksUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.feedbackRepository = repositoryFactory.createFeedbackRepository();
        this.unitOfWork.prepare(this.feedbackRepository);
    }

    protected async impl({ requestUser, queryOptions }: FetchFeedbacksUseCaseInput): Promise<FetchFeedbacksUseCaseOutput> {
        return this.unitOfWork.execute<FetchFeedbacksUseCaseOutput>(async () => {
            const { filter = {} } = queryOptions || {};
            if (!requestUser.isAdmin) filter.userId = requestUser.id;
            const count = await this.feedbackRepository.count(filter);
            const results = await this.feedbackRepository.find({ ...queryOptions, filter });
            return right({ count, results });
        });
    }
}
