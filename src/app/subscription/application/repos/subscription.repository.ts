import { IRepository } from "@/infra/database";

import { SubscriptionDTO } from "../../domain/models/subscription";

export type SubscriptionWhereRepository = SubscriptionDTO;

export type ISubscriptionRepository = IRepository<SubscriptionDTO>;
