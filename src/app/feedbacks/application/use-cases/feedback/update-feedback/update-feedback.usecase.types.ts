import { Either } from "ts-arch-kit/dist/core/helpers";
import { PrimaryKey } from "ts-arch-kit/dist/core/models";

import { NotFoundModelError, ValidationError } from "@/app/_common";
import { FeedbackDTO, UpdateFeedbackDTO } from "@/app/feedbacks/domain/models/feedback";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type UpdateFeedbackUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type UpdateFeedbackUseCaseInput = UpdateFeedbackDTO & {
    id: PrimaryKey;
    requestUser: AuthenticatedUserDTO;
};

export type UpdateFeedbackUseCaseOutput = Either<NotFoundModelError | ValidationError, FeedbackDTO>;
