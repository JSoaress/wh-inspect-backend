import { ProjectDTO, ProjectEntityFactory } from "@/app/projects/domain/models/project";

import { DbFilterOptions } from "../../helpers";
import { IDbMapper } from "../db-mapper";
import { PgProjectDTO } from "../models";

export class ProjectPgMapper implements IDbMapper<ProjectDTO, PgProjectDTO> {
    filterOptions: DbFilterOptions;
    _isNew = false;
    _isDirty = false;

    constructor() {
        this.filterOptions = {
            columns: {
                id: { columnName: "id", type: "string" },
                name: { columnName: "name", type: "string" },
                description: { columnName: "description", type: "string" },
                slug: { columnName: "slug", type: "string" },
                createdAt: { columnName: "created_at", type: "date" },
                isActive: { columnName: "is_active", type: "boolean" },
                members: { columnName: "members", type: "string" },
                owner: { columnName: "owner", type: "string" },
                sourceSubscription: { columnName: "source_subscription", type: "string" },
            },
        };
    }

    toDomain(persistence: PgProjectDTO): ProjectDTO {
        return ProjectEntityFactory.restore({
            id: persistence.id,
            name: persistence.name,
            description: persistence.description,
            slug: persistence.slug,
            createdAt: persistence.created_at,
            isActive: persistence.is_active,
            members: persistence.members.split(","),
            owner: persistence.owner,
            sourceSubscription: persistence.source_subscription,
        });
    }

    toPersistence(entity: ProjectDTO): Partial<PgProjectDTO> {
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            slug: entity.slug,
            created_at: entity.createdAt,
            is_active: entity.isActive,
            members: entity.members.join(","),
            owner: entity.owner,
            source_subscription: entity.sourceSubscription,
        };
    }
}
