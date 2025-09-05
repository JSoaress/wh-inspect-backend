import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { Entity, ValidationError } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";
import { ZodValidator } from "@/infra/libs/zod";

import { PaymentMethods, SubscriptionDTO, SubscriptionEntityFactory } from "../subscription";
import { CreatePlanDTO, PlanDTO, PlanSchema, RestorePlanDTO } from "./plan.dto";

export class Plan extends Entity<PlanDTO> {
    static create(input: CreatePlanDTO): Either<ValidationError, Plan> {
        const validDataOrError = ZodValidator.validate({ ...input, createdAt: new Date() }, PlanSchema);
        if (!validDataOrError.success) return left(new ValidationError("Plan", validDataOrError.errors));
        return right(new Plan(validDataOrError.data));
    }

    static restore(input: RestorePlanDTO) {
        return new Plan(input);
    }

    get name() {
        return this.props.name;
    }

    get price() {
        return this.props.price;
    }

    get isPaid() {
        return this.props.isPaid;
    }

    get billingCycle() {
        return this.props.billingCycle;
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

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    get visible() {
        return this.props.visible;
    }

    get isActive() {
        return this.props.isActive;
    }

    getDaysUntilNextPayment(): number {
        if (!this.isPaid) return 0;
        if (this.billingCycle === "monthly") return 30;
        if (this.billingCycle === "quarterly") return 90;
        return 365;
    }

    subscribe(subscriber: User, paymentMethod: PaymentMethods): Either<ValidationError, SubscriptionDTO> {
        const now = new Date();
        const subscriptionOrError = SubscriptionEntityFactory.create({
            planId: this.getId(),
            userId: subscriber.getId(),
            price: this.price,
            startDate: now,
            lastPayment: now,
            paymentMethod,
            nextPayment: this.isPaid ? now.setDate(now.getDate() + this.getDaysUntilNextPayment()) : null,
            eventsMonth: this.eventsMonth,
            retention: this.retention,
            replayEvents: this.replayEvents,
            support: this.support,
        });
        if (subscriptionOrError.isLeft()) return left(subscriptionOrError.value);
        return right(subscriptionOrError.value);
    }
}
