import { parseNumber } from "ts-arch-kit/dist/core/helpers";

import { Subscription, SubscriptionEntityFactory } from "@/app/subscription/domain/models/subscription";

import { DbFilterOptions } from "../../helpers";
import { IDbMapper } from "../db-mapper";
import { PgSubscriptionDTO } from "../models";

export class SubscriptionPgMapper implements IDbMapper<Subscription, PgSubscriptionDTO> {
    filterOptions: DbFilterOptions;

    constructor() {
        this.filterOptions = {
            columns: {
                id: { columnName: "id", type: "string" },
                userId: { columnName: "user_id", type: "string" },
                planId: { columnName: "plan_id", type: "string" },
                tier: { columnName: "tier", type: "number" },
                price: { columnName: "price", type: "number" },
                startDate: { columnName: "start_date", type: "date" },
                endDate: { columnName: "end_date", type: "date" },
                paymentMethod: { columnName: "payment_method", type: "string" },
                lastPayment: { columnName: "last_payment", type: "date" },
                nextPayment: { columnName: "next_payment", type: "date" },
                maxProjects: { columnName: "max_projects", type: "number" },
                eventsMonth: { columnName: "events_month", type: "number" },
                retention: { columnName: "retention", type: "number" },
                replayEvents: { columnName: "replay_events", type: "boolean" },
                support: { columnName: "support", type: "string" },
            },
        };
    }

    toDomain(persistence: PgSubscriptionDTO): Subscription {
        return SubscriptionEntityFactory.restore({
            id: persistence.id,
            userId: persistence.user_id,
            planId: persistence.plan_id,
            tier: persistence.tier,
            price: parseNumber(persistence.price),
            startDate: persistence.start_date,
            endDate: persistence.end_date,
            paymentMethod: persistence.payment_method,
            lastPayment: persistence.last_payment,
            nextPayment: persistence.next_payment,
            maxProjects: persistence.max_projects,
            eventsMonth: persistence.events_month,
            retention: persistence.retention,
            replayEvents: persistence.replay_events,
            support: persistence.support,
        });
    }

    toPersistence(entity: Subscription): Partial<PgSubscriptionDTO> {
        return {
            id: entity.getId(),
            user_id: entity.isNew || entity.checkDirtyProps("userId") ? entity.userId : undefined,
            plan_id: entity.isNew || entity.checkDirtyProps("planId") ? entity.planId : undefined,
            tier: entity.isNew || entity.checkDirtyProps("tier") ? entity.tier : undefined,
            price: entity.isNew || entity.checkDirtyProps("price") ? entity.price : undefined,
            start_date: entity.isNew || entity.checkDirtyProps("startDate") ? entity.startDate : undefined,
            end_date: entity.isNew || entity.checkDirtyProps("endDate") ? entity.endDate : undefined,
            payment_method: entity.isNew || entity.checkDirtyProps("paymentMethod") ? entity.paymentMethod : undefined,
            last_payment: entity.isNew || entity.checkDirtyProps("lastPayment") ? entity.lastPayment : undefined,
            next_payment: entity.isNew || entity.checkDirtyProps("nextPayment") ? entity.nextPayment : undefined,
            max_projects: entity.isNew || entity.checkDirtyProps("maxProjects") ? entity.maxProjects : undefined,
            events_month: entity.isNew || entity.checkDirtyProps("eventsMonth") ? entity.eventsMonth : undefined,
            retention: entity.isNew || entity.checkDirtyProps("retention") ? entity.retention : undefined,
            replay_events: entity.isNew || entity.checkDirtyProps("replayEvents") ? entity.replayEvents : undefined,
            support: entity.isNew || entity.checkDirtyProps("support") ? entity.support : undefined,
        };
    }
}
