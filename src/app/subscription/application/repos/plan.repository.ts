import { IRepository } from "@/infra/database";

import { Plan, PlanDTO } from "../../domain/models/plan";

export type PlanWhereRepository = PlanDTO;

export type IPlanRepository = IRepository<Plan>;
