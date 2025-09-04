import { randomUUID } from "node:crypto";
import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { ValidationError } from "@/app/_common";
import { ZodValidator } from "@/infra/libs/zod";

import { CreateProjectDTO, ProjectDTO, ProjectSchema, UpdateProjectDTO } from "./project.dto";

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

function update(project: ProjectDTO, input: UpdateProjectDTO): Either<ValidationError, ProjectDTO> {
    const { id, slug, owner } = project;
    const validDataOrError = ZodValidator.validate({ ...input, slug, owner }, ProjectSchema);
    if (!validDataOrError.success) return left(new ValidationError("Project", validDataOrError.errors));
    const { members, ...projectProps } = validDataOrError.data;
    const uniqueMembers = Array.from(new Set([...members, projectProps.owner]));
    return right({ id, ...validDataOrError.data, members: uniqueMembers });
}

export const ProjectEntityFactory = { create, restore, update };
