import { RequireOnly } from "ts-arch-kit/dist/core/helpers";
import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { z } from "@/infra/libs/zod";

export const PlanSchema = z.object({
    name: z.string(),
    price: z.coerce.number().nonnegative(),
    isPaid: z.boolean(),
    tier: z.coerce.number().int().nonnegative(),
    billingCycle: z.enum(["monthly", "quarterly", "annual"]),
    maxProjects: z.coerce.number().int(),
    eventsMonth: z.coerce.number().int(),
    retention: z.coerce.number().int(),
    replayEvents: z.boolean().default(false),
    support: z.enum(["community", "email", "priority"]),
    createdAt: z.coerce.date().default(() => new Date()),
    updatedAt: z.coerce.date().nullish().default(null),
    visible: z.coerce.boolean().default(true),
    isActive: z.coerce.boolean().default(true),
});

type Schema = typeof PlanSchema;

export type PlanDTO = AbstractModelProps & z.output<Schema>;

export type CreatePlanDTO = Omit<z.input<Schema>, "createdAt" | "updatedAt">;

export type UpdatePlanDTO = Partial<CreatePlanDTO>;

export type RestorePlanDTO = RequireOnly<PlanDTO, "id">;
