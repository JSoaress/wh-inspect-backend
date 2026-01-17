import { FeedbackDTO, FeedbackEntityFactory } from "@/app/feedbacks/domain/models/feedback";

import { DbFilterOptions } from "../../helpers";
import { DbMapper } from "../db-mapper";
import { PgFeedbackDTO } from "../models";

export class FeedbackPgMapper extends DbMapper<FeedbackDTO, PgFeedbackDTO> {
    filterOptions: DbFilterOptions<FeedbackDTO> = {
        columns: {
            id: { columnName: "id" },
            userId: { columnName: "user_id" },
            type: { columnName: "type" },
            application: { columnName: "application" },
            title: { columnName: "title" },
            description: { columnName: "description" },
            status: { columnName: "status" },
            priority: { columnName: "priority" },
            pageUrl: { columnName: "page_url" },
            userAgent: { columnName: "user_agent" },
            answer: { columnName: "answer" },
            createdAt: { columnName: "created_at" },
            updatedAt: { columnName: "updated_at" },
        },
    };

    constructor() {
        super(FeedbackEntityFactory.restore);
    }
}
