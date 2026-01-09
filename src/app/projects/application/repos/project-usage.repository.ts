import { IRepository } from "@/infra/database";

import { ProjectUsage, ProjectUsageDTO } from "../../domain/models/project-usage";

export type ProjectUsageWhereRepository = ProjectUsageDTO;

export type IProjectUsageRepository = IRepository<ProjectUsage, ProjectUsageWhereRepository>;
