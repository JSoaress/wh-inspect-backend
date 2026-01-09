import { RequireOnly } from "ts-arch-kit/dist/core/helpers";
import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { z } from "@/infra/libs/zod";

export const ProjectUsageSchema = z.object({
    projectId: z.uuidv7(),
    year: z.coerce.number().int().min(2026),
    month: z.coerce.number().int().min(1).max(12),
    maxEvents: z.coerce.number().int().nonnegative(),
    eventsCount: z.coerce.number().int().nonnegative().default(0),
    updatedAt: z.coerce.date().nullish().default(null),
});

type Schema = typeof ProjectUsageSchema;

export type ProjectUsageDTO = AbstractModelProps & z.output<Schema>;

export type CreateProjectUsageDTO = Omit<z.input<Schema>, "eventsCount" | "updatedAt">;

export type RestoreProjectUsageDTO = RequireOnly<ProjectUsageDTO, "id">;
