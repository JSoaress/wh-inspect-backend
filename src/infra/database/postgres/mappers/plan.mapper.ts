import { parseNumber } from "ts-arch-kit/dist/core/helpers";

import { Plan, PlanEntityFactory } from "@/app/subscription/domain/models/plan";

import { DbFilterOptions } from "../../helpers";
import { DbMapper } from "../db-mapper";
import { PgPlanDTO } from "../models";

export class PlanPgMapper extends DbMapper<Plan, PgPlanDTO> {
    filterOptions: DbFilterOptions<Plan> = {
        columns: {
            id: { columnName: "id" },
            name: { columnName: "name" },
            price: { columnName: "price", toDomain: (p: PgPlanDTO) => parseNumber(p.price) },
            isPaid: { columnName: "is_paid" },
            tier: { columnName: "tier" },
            billingCycle: { columnName: "billing_cycle" },
            maxProjects: { columnName: "max_projects" },
            eventsMonth: { columnName: "events_month" },
            retention: { columnName: "retention" },
            replayEvents: { columnName: "replay_events" },
            support: { columnName: "support" },
            createdAt: { columnName: "created_at" },
            updatedAt: { columnName: "updated_at" },
            visible: { columnName: "visible" },
            isActive: { columnName: "is_active" },
        },
    };

    constructor() {
        super(PlanEntityFactory.restore);
    }
}
