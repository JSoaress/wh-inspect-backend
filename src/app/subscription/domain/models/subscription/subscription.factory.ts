import { CreateSubscriptionDTO, RestoreSubscriptionDTO } from "./subscription.dto";
import { Subscription } from "./subscription.entity";

function create(input: CreateSubscriptionDTO) {
    return Subscription.create(input);
}

function restore(input: RestoreSubscriptionDTO) {
    return Subscription.restore(input);
}

export const SubscriptionEntityFactory = { create, restore };
