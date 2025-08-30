import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { z } from "@/infra/libs/zod";

export const PlanSchema = z.object({
    name: z.string(),
    price: z.coerce.number().nonnegative(),
    eventsMonth: z.coerce.number().int().positive(),
    retention: z.coerce.number().int().positive(),
    replayEvents: z.coerce.number().int().positive(),
    support: z.enum(["community", "email", "priority"]),
    createdAt: z.coerce.date().default(() => new Date()),
    visible: z.coerce.boolean().default(true),
    isActive: z.coerce.boolean().default(true),
});

type Schema = typeof PlanSchema;

export type PlanDTO = Required<AbstractModelProps> & z.output<Schema>;

export type CreatePlanDTO = z.input<Schema>;
