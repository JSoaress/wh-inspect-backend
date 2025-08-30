import { IRepository } from "@/infra/database";

import { PlanDTO } from "../../domain/models/plan";

export type PlanWhereRepository = PlanDTO;

export type IPlanRepository = IRepository<PlanDTO>;
