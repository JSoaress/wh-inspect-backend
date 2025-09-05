import { CreatePlanDTO, RestorePlanDTO } from "./plan.dto";
import { Plan } from "./plan.entity";

function create(input: CreatePlanDTO) {
    return Plan.create(input);
}

function restore(input: RestorePlanDTO) {
    return Plan.restore(input);
}

export const PlanEntityFactory = { create, restore };
