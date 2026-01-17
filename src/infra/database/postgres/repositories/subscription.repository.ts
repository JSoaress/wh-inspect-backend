import { parseNumber } from "ts-arch-kit/dist/core/helpers";
import { PrimaryKey } from "ts-arch-kit/dist/core/models";

import { ISubscriptionRepository, SubscriptionsCovered } from "@/app/subscription/application/repos";
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

    async getCurrentSubscriptionByUser(user: User): Promise<Subscription | null> {
        return this.findOne({ filter: { userId: user.getId(), endDate: { $isNull: true } } });
    }

    async getConsumptionByUser(user: User): Promise<SubscriptionConsumptionDTO> {
        const queryProjects = "SELECT count(id) FROM projects WHERE owner = $1";
        const {
            rows: [rowProject],
        } = await this.query(queryProjects, [user.getId()]);
        const now = new Date();
        const yearMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;
        const queryEvents = `SELECT sum(pu.events_count) AS count FROM project_usage pu
        INNER JOIN projects p ON pu.project_id = p.id
        WHERE p."owner" = $1 AND pu.year_month = $2;`;
        const {
            rows: [rowEvents],
        } = await this.query(queryEvents, [user.getId(), yearMonth]);
        return {
            projects: parseNumber(rowProject.count),
            eventsThisMonth: parseNumber(rowEvents.count),
        };
    }

    async getSubscriptionsCoveredBy(userId: PrimaryKey, subscriptionId: PrimaryKey): Promise<SubscriptionsCovered[]> {
        const sql1 = `SELECT id, tier FROM ${this.tableName} WHERE id = $1`;
        const {
            rows: [currentSubscription],
        } = await this.query(sql1, [subscriptionId]);
        const sql2 = `SELECT s.id FROM ${this.tableName} s WHERE s.user_id = $1 AND s.tier <= $2`;
        const { rows } = await this.query(sql2, [userId, currentSubscription.tier]);
        return rows.map((row) => ({ id: row.id }));
    }
}
