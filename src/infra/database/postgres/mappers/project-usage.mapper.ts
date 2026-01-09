import { parseNumber } from "ts-arch-kit/dist/core/helpers";

import { ProjectUsage, ProjectUsageEntityFactory } from "@/app/projects/domain/models/project-usage";

import { DbFilterOptions } from "../../helpers";
import { IDbMapper } from "../db-mapper";
import { PgProjectUsageDTO } from "../models";

export class ProjectUsagePgMapper implements IDbMapper<ProjectUsage, PgProjectUsageDTO> {
    filterOptions: DbFilterOptions;

    constructor() {
        this.filterOptions = {
            columns: {
                id: { columnName: "id", type: "number" },
                projectId: { columnName: "project_id", type: "string" },
                yearMonth: { columnName: "year_month", type: "string" },
                maxEvents: { columnName: "max_events", type: "number" },
                eventsCount: { columnName: "events_count", type: "number" },
                updatedAt: { columnName: "updated_at", type: "date" },
            },
        };
    }

    toDomain(persistence: PgProjectUsageDTO): ProjectUsage {
        const [year, month] = persistence.year_month.split("/");
        return ProjectUsageEntityFactory.restore({
            id: persistence.id,
            projectId: persistence.project_id,
            year: parseNumber(year),
            month: parseNumber(month),
            maxEvents: persistence.max_events,
            eventsCount: persistence.events_count,
            updatedAt: persistence.updated_at,
        });
    }

    toPersistence(entity: ProjectUsage): Partial<PgProjectUsageDTO> {
        return {
            id: entity.id,
            project_id: entity.projectId,
            year_month: `${entity.year}/${entity.month}`,
            max_events: entity.maxEvents,
            events_count: entity.eventsCount,
            updated_at: entity.updatedAt,
        };
    }
}
