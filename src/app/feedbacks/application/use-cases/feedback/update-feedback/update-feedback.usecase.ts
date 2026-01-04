import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";
import { FeedbackEntityFactory } from "@/app/feedbacks/domain/models/feedback";

import { IFeedbackRepository } from "../../../repos";
import {
    UpdateFeedbackUseCaseGateway,
    UpdateFeedbackUseCaseInput,
    UpdateFeedbackUseCaseOutput,
} from "./update-feedback.usecase.types";

export class UpdateFeedbackUseCase extends UseCase<UpdateFeedbackUseCaseInput, UpdateFeedbackUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private feedbackRepository: IFeedbackRepository;

    constructor({ repositoryFactory }: UpdateFeedbackUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.feedbackRepository = repositoryFactory.createFeedbackRepository();
        this.unitOfWork.prepare(this.feedbackRepository);
    }

    protected async impl(input: UpdateFeedbackUseCaseInput): Promise<UpdateFeedbackUseCaseOutput> {
        return this.unitOfWork.execute<UpdateFeedbackUseCaseOutput>(async () => {
            const feedback = await this.feedbackRepository.findOne({ filter: { id: input.id } });
            if (!feedback) return left(new NotFoundModelError("Feedback", input.id));
            const updateOrError = FeedbackEntityFactory.update(feedback, input);
            if (updateOrError.isLeft()) return left(updateOrError.value);
            const updatedFeedback = await this.feedbackRepository.save(updateOrError.value);
            return right(updatedFeedback);
        });
    }
}
