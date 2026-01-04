import { Either } from "ts-arch-kit/dist/core/helpers";

import { ValidationError } from "@/app/_common";
import { CreateFeedbackDTO, FeedbackDTO } from "@/app/feedbacks/domain/models/feedback";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type CreateFeedbackUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type CreateFeedbackUseCaseInput = Omit<CreateFeedbackDTO, "userId"> & {
    requestUser: AuthenticatedUserDTO;
};

export type CreateFeedbackUseCaseOutput = Either<ValidationError, FeedbackDTO>;
