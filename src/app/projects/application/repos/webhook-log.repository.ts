import { QueryOptions } from "ts-arch-kit/dist/database";

import { IRepository } from "@/infra/database";

import { ProjectDTO } from "../../domain/models/project";
import { SimplifiedWebhook, WebHookLogDTO } from "../../domain/models/webhook";

export type WebhookLogWhereRepository = WebHookLogDTO;

export interface IWebhookLogRepository extends IRepository<WebHookLogDTO, WebhookLogWhereRepository> {
    destroyByProject(project: ProjectDTO): Promise<void>;
    findSimplified(queryOptions?: QueryOptions<WebhookLogWhereRepository>): Promise<SimplifiedWebhook[]>;
}
