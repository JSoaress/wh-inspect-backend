import { IRepository } from "@/infra/database";

import { ProjectDTO } from "../../domain/models/project";
import { WebHookLogDTO } from "../../domain/models/webhook";

export type WebhookLogWhereRepository = WebHookLogDTO;

export interface IWebhookLogRepository extends IRepository<WebHookLogDTO, WebhookLogWhereRepository> {
    destroyByProject(project: ProjectDTO): Promise<void>;
}
