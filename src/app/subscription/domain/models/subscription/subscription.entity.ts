import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { Entity, InvalidSubscriptionActionError, PlanLimitReachedError, ValidationError } from "@/app/_common";
import { ZodValidator } from "@/infra/libs/zod";

import {
    CreateSubscriptionDTO,
    RestoreSubscriptionDTO,
    SubscriptionConsumptionDTO,
    SubscriptionDTO,
    SubscriptionSchema,
} from "./subscription.dto";

export class Subscription extends Entity<SubscriptionDTO> {
    static create(input: CreateSubscriptionDTO): Either<ValidationError, Subscription> {
        const validDataOrError = ZodValidator.validate(input, SubscriptionSchema);
        if (!validDataOrError.success) return left(new ValidationError(Subscription.name, validDataOrError.errors));
        return right(new Subscription(validDataOrError.data));
    }

    static restore(input: RestoreSubscriptionDTO) {
        return new Subscription(input);
    }

    get userId() {
        return this.props.userId;
    }

    get planId() {
        return this.props.planId;
    }

    get price() {
        return this.props.price;
    }

    get startDate() {
        return this.props.startDate;
    }

    get endDate() {
        return this.props.endDate;
    }

    get paymentMethod() {
        return this.props.paymentMethod;
    }

    get lastPayment() {
        return this.props.lastPayment;
    }

    get nextPayment() {
        return this.props.nextPayment;
    }

    get maxProjects() {
        return this.props.maxProjects;
    }

    get eventsMonth() {
        return this.props.eventsMonth;
    }

    get retention() {
        return this.props.retention;
    }

    get replayEvents() {
        return this.props.replayEvents;
    }

    get support() {
        return this.props.support;
    }

    checkConsumption(
        action: string,
        consumption: SubscriptionConsumptionDTO
    ): Either<InvalidSubscriptionActionError | PlanLimitReachedError, true> {
        switch (action) {
            case "add-project": {
                if (!(this.maxProjects < 0 || consumption.projects + 1 <= this.maxProjects))
                    return left(new PlanLimitReachedError("projetos", this.maxProjects));
                return right(true);
            }
            case "replay-event": {
                if (!this.replayEvents) return left(new PlanLimitReachedError("replay"));
            }
            // eslint-disable-next-line no-fallthrough
            case "receive-event": {
                if (!(this.eventsMonth < 0 || consumption.eventsThisMonth + 1 <= this.eventsMonth))
                    return left(new PlanLimitReachedError("webhooks", this.eventsMonth));
                return right(true);
            }
            default:
                return left(new InvalidSubscriptionActionError(action));
        }
    }
}
