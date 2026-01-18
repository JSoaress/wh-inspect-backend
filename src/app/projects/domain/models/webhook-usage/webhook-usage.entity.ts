import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { Entity, ValidationError } from "@/app/_common";
import { ZodValidator } from "@/infra/libs/zod";

import { CreateWebhookUsageDTO, WebhookUsageDTO, WebhookUsageSchema, RestoreWebhookUsageDTO } from "./webhook-usage.dto";

export class WebhookUsage extends Entity<WebhookUsageDTO> {
    private constructor(props: WebhookUsageDTO) {
        super(props, () => 0);
    }

    static create(props: CreateWebhookUsageDTO): Either<ValidationError, WebhookUsage> {
        const validDataOrError = ZodValidator.validate(props, WebhookUsageSchema);
        if (!validDataOrError.success) return left(new ValidationError(WebhookUsage.name, validDataOrError.errors));
        return right(new WebhookUsage(validDataOrError.data));
    }

    static restore(props: RestoreWebhookUsageDTO) {
        return new WebhookUsage(props);
    }

    get subscriber() {
        return this.props.subscriber;
    }

    get year() {
        return this.props.year;
    }

    get month() {
        return this.props.month;
    }

    get maxEvents() {
        return this.props.maxEvents;
    }

    get eventsCount() {
        return this.props.eventsCount;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    count() {
        this.props.eventsCount += 1;
        this.props.updatedAt = new Date();
    }

    canReceiveEvent() {
        return this.maxEvents > this.eventsCount;
    }
}
