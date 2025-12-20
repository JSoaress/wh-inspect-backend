import { QueryOptions } from "ts-arch-kit/dist/database";

import { IWebhookLogRepository } from "@/app/projects/application/repos";
import { ProjectDTO } from "@/app/projects/domain/models/project";
import { SimplifiedWebhook, WebHookLogDTO } from "@/app/projects/domain/models/webhook";
import { select } from "@rusdidev/pg-query-builder";

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
        await this.query(query, [project.id]);
    }

    async findSimplified(queryOptions?: QueryOptions): Promise<SimplifiedWebhook[]> {
        const columns: DbColumns = {};
        Object.entries(this.mapper.filterOptions.columns).forEach(([k, v]) => {
            columns[k] = { ...v, columnName: `w.${v.columnName}` };
        });
        const filterOptions: DbFilterOptions = { ...this.mapper.filterOptions, columns };
        const stmt = select({ table: this.tableName, alias: "w" })
            .addSelectItems("w.id", "w.project_id", "p.name", "w.received_from", "w.received_at", "w.replayed_at")
            .addJoinTarget({
                joinType: "JOIN",
                targetTable: "projects",
                alias: "p",
                targetColumn: "id",
                previousColumn: "project_id",
            });
        this.filter(stmt, filterOptions, queryOptions?.filter);
        this.sort(stmt, columns, queryOptions?.sort);
        this.pagination(stmt, queryOptions?.pagination);
        const [query, values] = stmt.compile();
        const { rows } = await this.query(query, values);
        return rows.map((r) => ({
            id: r.id,
            project: {
                id: r.project_id,
                name: r.name,
            },
            receivedFrom: r.received_from,
            receivedAt: r.received_at,
            replayedAt: r.replayed_at,
        }));
    }
}
