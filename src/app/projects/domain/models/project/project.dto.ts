import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { z } from "@/infra/libs/zod";

export const ProjectSchema = z.object({
    owner: z.uuidv7(),
    name: z.coerce.string(),
    description: z.coerce.string().nullish().default(null),
    slug: z.coerce.string(),
    createdAt: z.coerce.date().default(() => new Date()),
    isActive: z.coerce.boolean().default(true),
    members: z.array(z.uuidv7()),
});

type Schema = typeof ProjectSchema;

export type ProjectDTO = Required<AbstractModelProps> & z.output<Schema>;

export type CreateProjectDTO = z.input<Schema>;
