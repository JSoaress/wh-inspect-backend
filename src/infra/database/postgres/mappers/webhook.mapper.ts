import { WebHookLogDTO, WebHookLogEntityFactory } from "@/app/projects/domain/models/webhook";

import { DbFilterOptions } from "../../helpers";
import { IDbMapper } from "../db-mapper";
import { PgWebhookLogDTO } from "../models";

export class WebhookLogPgMapper implements IDbMapper<WebHookLogDTO, PgWebhookLogDTO> {
    filterOptions: DbFilterOptions;

    constructor() {
        this.filterOptions = {
            columns: {
                id: { columnName: "id", type: "string" },
                projectId: { columnName: "project_id", type: "string" },
                receivedFrom: { columnName: "received_from", type: "string" },
                receivedAt: { columnName: "received_at", type: "date" },
                headers: { columnName: "headers", type: "string" },
                body: { columnName: "body", type: "string" },
                query: { columnName: "query", type: "string" },
                statusCodeSent: { columnName: "status_code_sent", type: "number" },
                replayedFrom: { columnName: "replayed_from", type: "string" },
                replayedAt: { columnName: "replayed_at", type: "date" },
                replayStatus: { columnName: "replay_status", type: "string" },
                targetUrl: { columnName: "target_url", type: "string" },
                sourceSubscription: { columnName: "source_subscription", type: "string" },
            },
        };
    }

    toDomain(persistence: PgWebhookLogDTO): WebHookLogDTO {
        return WebHookLogEntityFactory.restore({
            id: persistence.id,
            projectId: persistence.project_id,
            receivedFrom: persistence.received_from,
            receivedAt: persistence.received_at,
            headers: persistence.headers,
            query: persistence.query,
            body: persistence.body,
            statusCodeSent: persistence.status_code_sent,
            replayedFrom: persistence.replayed_from,
            replayedAt: persistence.replayed_at,
            replayStatus: persistence.replay_status,
            targetUrl: persistence.target_url,
            sourceSubscription: persistence.source_subscription,
        });
    }

    toPersistence(entity: WebHookLogDTO): Partial<PgWebhookLogDTO> {
        return {
            id: entity.id,
            project_id: entity.projectId,
            received_from: entity.receivedFrom,
            received_at: entity.receivedAt,
            headers: entity.headers,
            query: entity.query,
            body: entity.body,
            status_code_sent: entity.statusCodeSent,
            replayed_from: entity.replayedFrom,
            replayed_at: entity.replayedAt,
            replay_status: entity.replayStatus,
            target_url: entity.targetUrl,
            source_subscription: entity.sourceSubscription,
        };
    }
}
