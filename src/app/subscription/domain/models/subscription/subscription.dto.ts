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
    eventsMonth: z.coerce.number().int().positive(),
    retention: z.coerce.number().int().positive(),
    replayEvents: z.coerce.number().int().positive(),
    support: z.enum(["community", "email", "priority"]),
});

type Schema = typeof SubscriptionSchema;

export type SubscriptionDTO = Required<AbstractModelProps> & z.output<Schema>;

export type CreateSubscriptionDTO = z.input<Schema>;

export type PaymentMethods = "free" | "pix" | "credit_card";
