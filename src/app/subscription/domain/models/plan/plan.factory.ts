import { randomUUID } from "node:crypto";
import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { ValidationError } from "@/app/_common";
import { ZodValidator } from "@/infra/libs/zod";

import { CreatePlanDTO, PlanDTO, PlanSchema } from "./plan.dto";

function create(input: CreatePlanDTO): Either<ValidationError, PlanDTO> {
    const validDataOrError = ZodValidator.validate(input, PlanSchema);
    if (!validDataOrError.success) return left(new ValidationError("Plan", validDataOrError.errors));
    return right({ id: randomUUID(), ...validDataOrError.data });
}

function restore(input: PlanDTO): PlanDTO {
    return { ...input };
}

export const PlanEntityFactory = { create, restore };
