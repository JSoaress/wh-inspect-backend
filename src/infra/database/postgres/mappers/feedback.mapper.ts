import { FeedbackDTO, FeedbackEntityFactory } from "@/app/feedbacks/domain/models/feedback";

import { DbFilterOptions } from "../../helpers";
import { IDbMapper } from "../db-mapper";
import { PgFeedbackDTO } from "../models";

export class FeedbackPgMapper implements IDbMapper<FeedbackDTO, PgFeedbackDTO> {
    filterOptions: DbFilterOptions;

    constructor() {
        this.filterOptions = {
            columns: {
                id: { columnName: "id", type: "string" },
                userId: { columnName: "user_id", type: "string" },
                type: { columnName: "type", type: "string" },
                application: { columnName: "application", type: "string" },
                title: { columnName: "title", type: "string" },
                description: { columnName: "description", type: "string" },
                status: { columnName: "status", type: "string" },
                priority: { columnName: "priority", type: "string" },
                pageUrl: { columnName: "page_url", type: "string" },
                userAgent: { columnName: "user_agent", type: "string" },
                answer: { columnName: "answer", type: "string" },
                createdAt: { columnName: "created_at", type: "date" },
                updatedAt: { columnName: "updated_at", type: "date" },
            },
        };
    }

    toDomain(persistence: PgFeedbackDTO): FeedbackDTO {
        return FeedbackEntityFactory.restore({
            id: persistence.id,
            userId: persistence.user_id,
            type: persistence.type,
            application: persistence.application,
            title: persistence.title,
            description: persistence.description,
            status: persistence.status,
            priority: persistence.priority,
            pageUrl: persistence.page_url,
            userAgent: persistence.user_agent,
            answer: persistence.answer,
            createdAt: persistence.created_at,
            updatedAt: persistence.updated_at,
        });
    }

    toPersistence(entity: FeedbackDTO): Partial<PgFeedbackDTO> {
        return {
            id: entity.id,
            user_id: entity.userId,
            type: entity.type,
            application: entity.application,
            title: entity.title,
            description: entity.description,
            status: entity.status,
            priority: entity.priority,
            page_url: entity.pageUrl,
            user_agent: entity.userAgent,
            answer: entity.answer,
            created_at: entity.createdAt,
            updated_at: entity.updatedAt,
        };
    }
}
