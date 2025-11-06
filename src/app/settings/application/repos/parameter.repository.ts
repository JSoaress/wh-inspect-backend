import { IRepository } from "@/infra/database";

import { ParameterDTO } from "../../domain/parameter";

export type ParameterWhereRepository = ParameterDTO;

export type IParameterRepository = IRepository<ParameterDTO, ParameterWhereRepository>;
