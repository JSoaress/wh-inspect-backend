import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { FeedbackEntityFactory } from "@/app/feedbacks/domain/models/feedback";

import { IFeedbackRepository } from "../../../repos";
import {
    CreateFeedbackUseCaseGateway,
    CreateFeedbackUseCaseInput,
    CreateFeedbackUseCaseOutput,
} from "./create-feedback.usecase.types";

export class CreateFeedbackUseCase extends UseCase<CreateFeedbackUseCaseInput, CreateFeedbackUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private feedbackRepository: IFeedbackRepository;

    constructor({ repositoryFactory }: CreateFeedbackUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.feedbackRepository = repositoryFactory.createFeedbackRepository();
        this.unitOfWork.prepare(this.feedbackRepository);
    }

    protected async impl({ requestUser, ...input }: CreateFeedbackUseCaseInput): Promise<CreateFeedbackUseCaseOutput> {
        return this.unitOfWork.execute<CreateFeedbackUseCaseOutput>(async () => {
            const feedbackOrError = FeedbackEntityFactory.create({
                ...input,
                userId: requestUser.id as string,
            });
            if (feedbackOrError.isLeft()) return left(feedbackOrError.value);
            const unsavedFeedback = feedbackOrError.value;
            const newFeedback = await this.feedbackRepository.save(unsavedFeedback);
            return right(newFeedback);
        });
    }
}
