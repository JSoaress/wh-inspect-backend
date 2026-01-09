import { CreateProjectUsageDTO, RestoreProjectUsageDTO } from "./project-usage.dto";
import { ProjectUsage } from "./project-usage.entity";

function create(input: CreateProjectUsageDTO) {
    return ProjectUsage.create(input);
}

function restore(input: RestoreProjectUsageDTO) {
    return ProjectUsage.restore(input);
}

export const ProjectUsageEntityFactory = { create, restore };
