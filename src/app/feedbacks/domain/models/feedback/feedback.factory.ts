import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { ValidationError } from "@/app/_common";
import { UUID } from "@/infra/adapters/uuid";
import { ZodValidator } from "@/infra/libs/zod";

import { CreateFeedbackDTO, FeedbackDTO, FeedbackSchema, UpdateFeedbackDTO } from "./feedback.dto";

function create(input: CreateFeedbackDTO): Either<ValidationError, FeedbackDTO> {
    const validDataOrError = ZodValidator.validate({ ...input, status: "open" }, FeedbackSchema);
    if (!validDataOrError.success) return left(new ValidationError("Feedback", validDataOrError.errors));
    return right({ id: UUID.generate("v7"), ...validDataOrError.data });
}

function update(original: FeedbackDTO, input: UpdateFeedbackDTO): Either<ValidationError, FeedbackDTO> {
    const { id, ...rest } = original;
    const props = { ...rest, ...input, updatedAt: new Date() };
    const validDataOrError = ZodValidator.validate(props, FeedbackSchema);
    if (!validDataOrError.success) return left(new ValidationError("Feedback", validDataOrError.errors));
    return right({ id, ...validDataOrError.data });
}

function restore(input: FeedbackDTO): FeedbackDTO {
    return { ...input };
}

export const FeedbackEntityFactory = { create, update, restore };
