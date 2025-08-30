import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { z } from "@/infra/libs/zod";

// TODO: alterar uuid do owner p/ v7
export const ProjectSchema = z.object({
    owner: z.uuid(),
    name: z.string(),
    description: z.string().nullish().default(null),
    slug: z.string(),
    createdAt: z.coerce.date().default(() => new Date()),
    isActive: z.coerce.boolean().default(true),
    members: z.array(z.uuid()).default([]),
});

type Schema = typeof ProjectSchema;

export type ProjectDTO = Required<AbstractModelProps> & z.output<Schema>;

export type CreateProjectDTO = z.input<Schema>;
