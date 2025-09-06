import { parseNumber } from "ts-arch-kit/dist/core/helpers";

import { ISubscriptionRepository } from "@/app/subscription/application/repos";
import { Subscription, SubscriptionConsumptionDTO } from "@/app/subscription/domain/models/subscription";
import { User } from "@/app/users/domain/models/user";

import { SubscriptionPgMapper } from "../mappers";
import { PgSubscriptionDTO } from "../models";
import { DefaultPgRepository } from "./default.repository";

export class SubscriptionPgRepository
    extends DefaultPgRepository<Subscription, PgSubscriptionDTO>
    implements ISubscriptionRepository
{
    constructor() {
        super("subscriptions", new SubscriptionPgMapper());
    }

    async getConsumptionByUser(user: User): Promise<SubscriptionConsumptionDTO> {
        const queryProjects = "SELECT count(id) FROM projects WHERE owner = $1";
        const trx = this.getTransaction();
        const {
            rows: [rowProject],
        } = await trx.query(queryProjects, [user.getId()]);
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const startDate = `${year}-${month}-01`;
        const endDate = `${year}-${month}-${now.getDate()}`;
        const queryEvents = `SELECT count(w.id) FROM webhooks w
        INNER JOIN projects p ON w.project_id = p.id
        WHERE p."owner" = $1 AND w.received_at BETWEEN $2 AND $3;`;
        const {
            rows: [rowEvents],
        } = await trx.query(queryEvents, [user.getId(), startDate, endDate]);
        return {
            projects: parseNumber(rowProject.count),
            eventsThisMonth: parseNumber(rowEvents.count),
        };
    }
}
