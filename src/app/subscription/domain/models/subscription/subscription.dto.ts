import { RequireOnly } from "ts-arch-kit/dist/core/helpers";
import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { z } from "@/infra/libs/zod";

export const SubscriptionSchema = z.object({
    userId: z.uuid(),
    planId: z.uuid(),
    price: z.coerce.number().nonnegative(),
    startDate: z.coerce.date().default(() => new Date()),
    endDate: z.coerce.date().nullish().default(null),
    paymentMethod: z.enum(["free", "pix", "credit_card"]),
    lastPayment: z.coerce.date().default(() => new Date()),
    nextPayment: z.coerce.date().nullish().default(null),
    maxProjects: z.coerce.number().int(),
    eventsMonth: z.coerce.number().int(),
    retention: z.coerce.number().int(),
    replayEvents: z.boolean().default(false),
    support: z.enum(["community", "email", "priority"]),
});

type Schema = typeof SubscriptionSchema;

export type SubscriptionDTO = AbstractModelProps & z.output<Schema>;

export type CreateSubscriptionDTO = z.input<Schema>;

export type RestoreSubscriptionDTO = RequireOnly<SubscriptionDTO, "id">;

export type PaymentMethods = "free" | "pix" | "credit_card";

export type SubscriptionConsumptionDTO = {
    projects: number;
    eventsThisMonth: number;
};
