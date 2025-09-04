import { IWebhookLogRepository } from "@/app/projects/application/repos";
import { ProjectDTO } from "@/app/projects/domain/models/project";
import { WebHookLogDTO } from "@/app/projects/domain/models/webhook";

import { WebhookLogPgMapper } from "../mappers";
import { PgWebhookLogDTO } from "../models";
import { DefaultPgRepository } from "./default.repository";

export class WebhookLogPgRepository
    extends DefaultPgRepository<WebHookLogDTO, PgWebhookLogDTO>
    implements IWebhookLogRepository
{
    constructor() {
        super("webhooks", new WebhookLogPgMapper());
    }

    async destroyByProject(project: ProjectDTO): Promise<void> {
        const query = `DELETE FROM ${this.tableName} WHERE project_id = $1;`;
        const trx = this.getTransaction();
        await trx.query(query, [project.id]);
    }
}
