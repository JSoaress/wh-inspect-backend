import { parseNumber } from "ts-arch-kit/dist/core/helpers";

import { ProjectUsage, ProjectUsageEntityFactory } from "@/app/projects/domain/models/project-usage";

import { DbFilterOptions } from "../../helpers";
import { DbMapper } from "../db-mapper";
import { PgProjectUsageDTO } from "../models";

export class ProjectUsagePgMapper extends DbMapper<ProjectUsage, PgProjectUsageDTO> {
    filterOptions: DbFilterOptions<ProjectUsage> = {
        columns: {
            id: { columnName: "id" },
            projectId: { columnName: "project_id" },
            year: {
                columnName: "year_month",
                toDomain: (pu: PgProjectUsageDTO) => parseNumber(pu.year_month.split("/")[0]),
                toPersistence: (pu: ProjectUsage) => `${pu.year}/${pu.month}`,
            },
            month: {
                columnName: "year_month",
                toDomain: (pu: PgProjectUsageDTO) => parseNumber(pu.year_month.split("/")[1]),
                toPersistence: (pu: ProjectUsage) => `${pu.year}/${pu.month}`,
            },
            yearMonth: { columnName: "year_month", noPersist: true },
            maxEvents: { columnName: "max_events" },
            eventsCount: { columnName: "events_count" },
            updatedAt: { columnName: "updated_at" },
        },
    };

    constructor() {
        super(ProjectUsageEntityFactory.restore);
    }
}
