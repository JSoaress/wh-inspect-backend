import { WebHookLogDTO, WebHookLogEntityFactory } from "@/app/projects/domain/models/webhook";

import { DbFilterOptions } from "../../helpers";
import { DbMapper } from "../db-mapper";
import { PgWebhookLogDTO } from "../models";

export class WebhookLogPgMapper extends DbMapper<WebHookLogDTO, PgWebhookLogDTO> {
    filterOptions: DbFilterOptions<WebHookLogDTO> = {
        columns: {
            id: { columnName: "id" },
            projectId: { columnName: "project_id" },
            receivedFrom: { columnName: "received_from" },
            receivedAt: { columnName: "received_at" },
            headers: { columnName: "headers" },
            body: { columnName: "body" },
            query: { columnName: "query" },
            statusCodeSent: { columnName: "status_code_sent" },
            replayedFrom: { columnName: "replayed_from" },
            replayedAt: { columnName: "replayed_at" },
            replayStatus: { columnName: "replay_status" },
            targetUrl: { columnName: "target_url" },
            sourceSubscription: { columnName: "source_subscription" },
            _outOfSubscription: { columnName: "out_of_subscription" },
        },
    };

    constructor() {
        super(WebHookLogEntityFactory.restore);
    }
}
