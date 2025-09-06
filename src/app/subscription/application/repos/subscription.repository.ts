import { User } from "@/app/users/domain/models/user";
import { IRepository } from "@/infra/database";

import { Subscription, SubscriptionConsumptionDTO, SubscriptionDTO } from "../../domain/models/subscription";

export type SubscriptionWhereRepository = SubscriptionDTO;

export interface ISubscriptionRepository extends IRepository<Subscription, SubscriptionWhereRepository> {
    getConsumptionByUser(user: User): Promise<SubscriptionConsumptionDTO>;
}
