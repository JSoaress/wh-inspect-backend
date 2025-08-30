import { parseNumber } from "ts-arch-kit/dist/core/helpers";

import { PlanDTO } from "@/app/subscription/domain/models/plan";

import { DbFilterOptions } from "../../helpers";
import { IDbMapper } from "../db-mapper";
import { PgPlanDTO } from "../models";

export class PlanPgMapper implements IDbMapper<PlanDTO, PgPlanDTO> {
    filterOptions: DbFilterOptions;

    constructor() {
        this.filterOptions = {
            columns: {
                id: { columnName: "id", type: "string" },
                name: { columnName: "name", type: "string" },
                price: { columnName: "price", type: "number" },
                eventsMonth: { columnName: "events_month", type: "number" },
                retention: { columnName: "retention", type: "number" },
                replayEvents: { columnName: "replay_events", type: "number" },
                support: { columnName: "support", type: "string" },
                createdAt: { columnName: "created_at", type: "date" },
                visible: { columnName: "visible", type: "boolean" },
                isActive: { columnName: "is_active", type: "boolean" },
            },
        };
    }

    toDomain(persistence: PgPlanDTO): PlanDTO {
        return {
            id: persistence.id,
            name: persistence.name,
            price: parseNumber(persistence.price),
            eventsMonth: persistence.events_month,
            retention: persistence.retention,
            replayEvents: persistence.replay_events,
            support: persistence.support,
            createdAt: persistence.created_at,
            visible: persistence.visible,
            isActive: persistence.is_active,
        };
    }

    toPersistence(entity: PlanDTO): Partial<PgPlanDTO> {
        return {
            id: entity.id,
            name: entity.name,
            price: entity.price,
            events_month: entity.eventsMonth,
            retention: entity.retention,
            replay_events: entity.replayEvents,
            support: entity.support,
            created_at: entity.createdAt,
            visible: entity.visible,
            is_active: entity.isActive,
        };
    }
}
