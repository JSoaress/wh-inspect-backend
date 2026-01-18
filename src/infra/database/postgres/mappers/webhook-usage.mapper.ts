import { parseNumber } from "ts-arch-kit/dist/core/helpers";

import { WebhookUsage, WebhookUsageEntityFactory } from "@/app/projects/domain/models/webhook-usage";

import { DbFilterOptions } from "../../helpers";
import { DbMapper } from "../db-mapper";
import { PgWebhookUsageDTO } from "../models";

export class WebhookUsagePgMapper extends DbMapper<WebhookUsage, PgWebhookUsageDTO> {
    filterOptions: DbFilterOptions<WebhookUsage> = {
        columns: {
            id: { columnName: "id" },
            subscriber: { columnName: "subscriber" },
            year: {
                columnName: "year_month",
                toDomain: (pu: PgWebhookUsageDTO) => parseNumber(pu.year_month.split("/")[0]),
                toPersistence: (pu: WebhookUsage) => `${pu.year}/${pu.month}`,
            },
            month: {
                columnName: "year_month",
                toDomain: (pu: PgWebhookUsageDTO) => parseNumber(pu.year_month.split("/")[1]),
                toPersistence: (pu: WebhookUsage) => `${pu.year}/${pu.month}`,
            },
            yearMonth: { columnName: "year_month", noPersist: true },
            maxEvents: { columnName: "max_events" },
            eventsCount: { columnName: "events_count" },
            updatedAt: { columnName: "updated_at" },
        },
    };

    constructor() {
        super(WebhookUsageEntityFactory.restore);
    }
}
