import { QueryOptions } from "ts-arch-kit/dist/database";

import { IWebhookLogRepository } from "@/app/projects/application/repos";
import { ProjectDTO } from "@/app/projects/domain/models/project";
import { SimplifiedWebhook, WebHookLogDTO } from "@/app/projects/domain/models/webhook";

import { DbColumns, DbFilterOptions } from "../../helpers";
import { WebhookLogPgMapper } from "../mappers";
import { PgWebhookLogDTO } from "../models";
import { DefaultPgRepository } from "./default.repository";

export class WebhookLogPgRepository
    extends DefaultPgRepository<WebHookLogDTO, PgWebhookLogDTO>
    implements IWebhookLogRepository
{
    constructor() {
        super("webhooks", new WebhookLogPgMapper());
    }

    async destroyByProject(project: ProjectDTO): Promise<void> {
        const query = `DELETE FROM ${this.tableName} WHERE project_id = $1;`;
        const trx = this.getTransaction();
        await trx.query(query, [project.id]);
    }

    async findSimplified(queryOptions?: QueryOptions): Promise<SimplifiedWebhook[]> {
        const columns: DbColumns = {};
        Object.entries(this.mapper.filterOptions.columns).forEach(([k, v]) => {
            columns[k] = { ...v, columnName: `w.${v.columnName}` };
        });
        const filterOptions: DbFilterOptions = { ...this.mapper.filterOptions, columns };
        const sql = `SELECT w.id, w.project_id, p.name, w.received_from, w.received_at
            FROM ${this.tableName} w
            INNER JOIN projects p ON p.id = w.project_id`;
        const where = this.filter(filterOptions, queryOptions?.filter);
        const sort = this.sort(columns, queryOptions?.sort);
        const pagination = this.pagination(queryOptions?.pagination);
        const query = this.prepareStmt([sql, where, sort, pagination]);
        const trx = this.getTransaction();
        const { rows } = await trx.query(query);
        return rows.map((r) => ({
            id: r.id,
            project: {
                id: r.project_id,
                name: r.name,
            },
            receivedFrom: r.received_from,
            receivedAt: r.received_at,
        }));
    }
}
