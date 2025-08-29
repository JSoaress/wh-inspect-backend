import { IRepository } from "@/infra/database";

import { ProjectDTO } from "../../domain/models/project/project.dto";

export type ProjectWhereRepository = ProjectDTO;

export type IProjectRepository = IRepository<ProjectDTO, ProjectWhereRepository>;
