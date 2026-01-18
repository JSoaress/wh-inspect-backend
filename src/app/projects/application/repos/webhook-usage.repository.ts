import { IRepository } from "@/infra/database";

import { WebhookUsage, WebhookUsageDTO } from "../../domain/models/webhook-usage";

export type WebhookUsageWhereRepository = WebhookUsageDTO;

export type IWebhookUsageRepository = IRepository<WebhookUsage, WebhookUsageWhereRepository>;
