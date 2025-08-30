import { randomUUID } from "node:crypto";
import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { ValidationError } from "@/app/_common";
import { ZodValidator } from "@/infra/libs/zod";

import { CreateProjectDTO, ProjectDTO, ProjectSchema } from "./project.dto";

function create(input: CreateProjectDTO): Either<ValidationError, ProjectDTO> {
    const validDataOrError = ZodValidator.validate(input, ProjectSchema);
    if (!validDataOrError.success) return left(new ValidationError("Project", validDataOrError.errors));
    const { members, ...projectProps } = validDataOrError.data;
    const uniqueMembers = Array.from(new Set([...members, projectProps.owner]));
    return right({ id: randomUUID(), ...validDataOrError.data, members: uniqueMembers });
}

function restore(input: ProjectDTO): ProjectDTO {
    return { ...input };
}

export const ProjectEntityFactory = { create, restore };
