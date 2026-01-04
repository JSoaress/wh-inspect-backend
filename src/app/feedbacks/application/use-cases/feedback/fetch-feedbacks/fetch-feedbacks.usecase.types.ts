import { Either } from "ts-arch-kit/dist/core/helpers";
import { QueryOptions } from "ts-arch-kit/dist/database";

import { Pagination, UnknownError } from "@/app/_common";
import { FeedbackDTO } from "@/app/feedbacks/domain/models/feedback";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

export type FetchFeedbacksUseCaseGateway = {
    repositoryFactory: IRepositoryFactory;
};

export type FetchFeedbacksUseCaseInput = {
    queryOptions?: QueryOptions;
    requestUser: AuthenticatedUserDTO;
};

export type FetchFeedbacksUseCaseOutput = Either<UnknownError, Pagination<FeedbackDTO>>;
