import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { ValidationError } from "@/app/_common";
import { ZodValidator } from "@/infra/libs/zod";

import { CreateWebHookLogDTO, WebHookLogDTO, WebHookLogSchema } from "./webhook.dto";

function create(input: CreateWebHookLogDTO): Either<ValidationError, WebHookLogDTO> {
    const validDataOrError = ZodValidator.validate(input, WebHookLogSchema);
    if (!validDataOrError.success) return left(new ValidationError("WebhookLog", validDataOrError.errors));
    return right({ id: 0, ...validDataOrError.data });
}

function restore(input: WebHookLogDTO): WebHookLogDTO {
    return { ...input };
}

export const WebHookLogEntityFactory = { create, restore };
