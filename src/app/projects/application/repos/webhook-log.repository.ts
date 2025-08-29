import { IRepository } from "@/infra/database";

import { WebHookLogDTO } from "../../domain/models/webhook";

export type WebhookLogWhereRepository = WebHookLogDTO;

export type IWebhookLogRepository = IRepository<WebHookLogDTO, WebhookLogWhereRepository>;
