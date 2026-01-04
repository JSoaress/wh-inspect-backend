import { IRepository } from "@/infra/database";

import { FeedbackDTO } from "../../domain/models/feedback";

export type FeedbackWhereRepository = FeedbackDTO;

export type IFeedbackRepository = IRepository<FeedbackDTO, FeedbackWhereRepository>;
