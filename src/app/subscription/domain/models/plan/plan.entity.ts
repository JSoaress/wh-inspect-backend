import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { Entity, ValidationError } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";
import { ZodValidator } from "@/infra/libs/zod";

import { PaymentMethods, Subscription, SubscriptionEntityFactory } from "../subscription";
import { CreatePlanDTO, PlanDTO, PlanSchema, RestorePlanDTO, UpdatePlanDTO } from "./plan.dto";

export class Plan extends Entity<PlanDTO> {
    static create(input: CreatePlanDTO): Either<ValidationError, Plan> {
        const validDataOrError = ZodValidator.validate({ ...input, createdAt: new Date() }, PlanSchema);
        if (!validDataOrError.success) return left(new ValidationError(Plan.name, validDataOrError.errors));
        return right(new Plan(validDataOrError.data));
    }

    static restore(input: RestorePlanDTO) {
        return new Plan(input);
    }

    update(input: UpdatePlanDTO): Either<ValidationError, void> {
        const validDataOrError = ZodValidator.validate({ ...this.props, ...input, updatedAt: new Date() }, PlanSchema);
        if (!validDataOrError.success) return left(new ValidationError(Plan.name, validDataOrError.errors));
        this.updateObj(validDataOrError.data, ["createdAt"]);
        return right(undefined);
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

    get tier() {
        return this.props.tier;
    }

    get billingCycle() {
        return this.props.billingCycle;
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

    subscribe(subscriber: User, paymentMethod: PaymentMethods): Either<ValidationError, Subscription> {
        const now = new Date();
        const subscriptionOrError = SubscriptionEntityFactory.create({
            planId: this.getId(),
            userId: subscriber.getId(),
            tier: this.tier,
            price: this.price,
            startDate: now,
            lastPayment: now,
            paymentMethod,
            nextPayment: this.isPaid ? now.setDate(now.getDate() + this.getDaysUntilNextPayment()) : null,
            maxProjects: this.maxProjects,
            eventsMonth: this.eventsMonth,
            retention: this.retention,
            replayEvents: this.replayEvents,
            support: this.support,
        });
        if (subscriptionOrError.isLeft()) return left(subscriptionOrError.value);
        return right(subscriptionOrError.value);
    }
}
