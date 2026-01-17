import { ProjectDTO, ProjectEntityFactory } from "@/app/projects/domain/models/project";

import { DbFilterOptions } from "../../helpers";
import { DbMapper } from "../db-mapper";
import { PgProjectDTO } from "../models";

export class ProjectPgMapper extends DbMapper<ProjectDTO, PgProjectDTO> {
    filterOptions: DbFilterOptions<ProjectDTO> = {
        columns: {
            id: { columnName: "id" },
            name: { columnName: "name" },
            description: { columnName: "description" },
            slug: { columnName: "slug" },
            createdAt: { columnName: "created_at" },
            isActive: { columnName: "is_active" },
            members: {
                columnName: "members",
                toDomain: (p: PgProjectDTO) => p.members.split(","),
                toPersistence: (p: ProjectDTO) => p.members.join(","),
            },
            owner: { columnName: "owner" },
            sourceSubscription: { columnName: "source_subscription" },
        },
    };

    constructor() {
        super(ProjectEntityFactory.restore);
    }
}
