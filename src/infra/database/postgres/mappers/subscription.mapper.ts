import { parseNumber } from "ts-arch-kit/dist/core/helpers";

import { Subscription, SubscriptionEntityFactory } from "@/app/subscription/domain/models/subscription";

import { DbFilterOptions } from "../../helpers";
import { DbMapper } from "../db-mapper";
import { PgSubscriptionDTO } from "../models";

export class SubscriptionPgMapper extends DbMapper<Subscription, PgSubscriptionDTO> {
    filterOptions: DbFilterOptions<Subscription> = {
        columns: {
            id: { columnName: "id" },
            userId: { columnName: "user_id" },
            planId: { columnName: "plan_id" },
            tier: { columnName: "tier" },
            price: { columnName: "price", toDomain: (s: PgSubscriptionDTO) => parseNumber(s.price) },
            startDate: { columnName: "start_date" },
            endDate: { columnName: "end_date" },
            paymentMethod: { columnName: "payment_method" },
            lastPayment: { columnName: "last_payment" },
            nextPayment: { columnName: "next_payment" },
            maxProjects: { columnName: "max_projects" },
            eventsMonth: { columnName: "events_month" },
            retention: { columnName: "retention" },
            replayEvents: { columnName: "replay_events" },
            support: { columnName: "support" },
        },
    };

    constructor() {
        super(SubscriptionEntityFactory.restore);
    }
}
