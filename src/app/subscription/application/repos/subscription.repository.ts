import { PrimaryKey } from "ts-arch-kit/dist/core/models";

import { User } from "@/app/users/domain/models/user";
import { IRepository } from "@/infra/database";

import { Subscription, SubscriptionConsumptionDTO, SubscriptionDTO } from "../../domain/models/subscription";

export type SubscriptionWhereRepository = SubscriptionDTO;

export type SubscriptionsCovered = { id: string };

export interface ISubscriptionRepository extends IRepository<Subscription, SubscriptionWhereRepository> {
    getCurrentSubscriptionByUser(user: User): Promise<Subscription | null>;
    getConsumptionByUser(user: User): Promise<SubscriptionConsumptionDTO>;
    getSubscriptionsCoveredBy(userId: PrimaryKey, subscriptionId: PrimaryKey): Promise<SubscriptionsCovered[]>;
}
