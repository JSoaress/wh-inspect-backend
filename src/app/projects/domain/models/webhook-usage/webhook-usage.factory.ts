import { CreateWebhookUsageDTO, RestoreWebhookUsageDTO } from "./webhook-usage.dto";
import { WebhookUsage } from "./webhook-usage.entity";

function create(input: CreateWebhookUsageDTO) {
    return WebhookUsage.create(input);
}

function restore(input: RestoreWebhookUsageDTO) {
    return WebhookUsage.restore(input);
}

export const WebhookUsageEntityFactory = { create, restore };
