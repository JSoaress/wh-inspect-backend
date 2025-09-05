import { parseNumber } from "ts-arch-kit/dist/core/helpers";

import { Plan, PlanEntityFactory } from "@/app/subscription/domain/models/plan";

import { DbFilterOptions } from "../../helpers";
import { IDbMapper } from "../db-mapper";
import { PgPlanDTO } from "../models";

export class PlanPgMapper implements IDbMapper<Plan, PgPlanDTO> {
    filterOptions: DbFilterOptions;

    constructor() {
        this.filterOptions = {
            columns: {
                id: { columnName: "id", type: "string" },
                name: { columnName: "name", type: "string" },
                price: { columnName: "price", type: "number" },
                isPaid: { columnName: "is_paid", type: "boolean" },
                billingCycle: { columnName: "billing_cycle", type: "string" },
                eventsMonth: { columnName: "events_month", type: "number" },
                retention: { columnName: "retention", type: "number" },
                replayEvents: { columnName: "replay_events", type: "number" },
                support: { columnName: "support", type: "string" },
                createdAt: { columnName: "created_at", type: "date" },
                updatedAt: { columnName: "updated_at", type: "date" },
                visible: { columnName: "visible", type: "boolean" },
                isActive: { columnName: "is_active", type: "boolean" },
            },
        };
    }

    toDomain(persistence: PgPlanDTO): Plan {
        return PlanEntityFactory.restore({
            id: persistence.id,
            name: persistence.name,
            price: parseNumber(persistence.price),
            isPaid: persistence.is_paid,
            billingCycle: persistence.billing_cycle,
            eventsMonth: persistence.events_month,
            retention: persistence.retention,
            replayEvents: persistence.replay_events,
            support: persistence.support,
            createdAt: persistence.created_at,
            updatedAt: persistence.updated_at,
            visible: persistence.visible,
            isActive: persistence.is_active,
        });
    }

    toPersistence(entity: Plan): Partial<PgPlanDTO> {
        return {
            id: entity.getId(),
            name: entity.isNew || entity.checkDirtyProps("name") ? entity.name : undefined,
            price: entity.isNew || entity.checkDirtyProps("price") ? entity.price : undefined,
            is_paid: entity.isNew || entity.checkDirtyProps("isPaid") ? entity.isPaid : undefined,
            billing_cycle: entity.isNew || entity.checkDirtyProps("billingCycle") ? entity.billingCycle : undefined,
            events_month: entity.isNew || entity.checkDirtyProps("eventsMonth") ? entity.eventsMonth : undefined,
            retention: entity.isNew || entity.checkDirtyProps("retention") ? entity.retention : undefined,
            replay_events: entity.isNew || entity.checkDirtyProps("replayEvents") ? entity.replayEvents : undefined,
            support: entity.isNew || entity.checkDirtyProps("support") ? entity.support : undefined,
            created_at: entity.isNew || entity.checkDirtyProps("createdAt") ? entity.createdAt : undefined,
            updated_at: entity.isNew || entity.checkDirtyProps("updatedAt") ? entity.updatedAt : undefined,
            visible: entity.isNew || entity.checkDirtyProps("visible") ? entity.visible : undefined,
            is_active: entity.isNew || entity.checkDirtyProps("isActive") ? entity.isActive : undefined,
        };
    }
}
