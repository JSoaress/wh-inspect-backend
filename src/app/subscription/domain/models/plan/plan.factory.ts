import { CreatePlanDTO, RestorePlanDTO, UpdatePlanDTO } from "./plan.dto";
import { Plan } from "./plan.entity";

function create(input: CreatePlanDTO) {
    return Plan.create(input);
}

function restore(input: RestorePlanDTO) {
    return Plan.restore(input);
}

function update(instance: Plan, input: UpdatePlanDTO) {
    return instance.update(input);
}

export const PlanEntityFactory = { create, update, restore };
