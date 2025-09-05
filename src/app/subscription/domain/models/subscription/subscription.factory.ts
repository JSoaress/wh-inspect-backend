import { randomUUID } from "node:crypto";
import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { ValidationError } from "@/app/_common";
import { ZodValidator } from "@/infra/libs/zod";

import { CreateSubscriptionDTO, SubscriptionDTO, SubscriptionSchema } from "./subscription.dto";

function create(input: CreateSubscriptionDTO): Either<ValidationError, SubscriptionDTO> {
    const validDataOrError = ZodValidator.validate(input, SubscriptionSchema);
    if (!validDataOrError.success) return left(new ValidationError("Subscription", validDataOrError.errors));
    return right({ id: randomUUID(), ...validDataOrError.data });
}

function restore(input: SubscriptionDTO): SubscriptionDTO {
    return { ...input };
}

export const SubscriptionEntityFactory = { create, restore };
