import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { z } from "@/infra/libs/zod";

export const FeedbackSchema = z.object({
    userId: z.uuid(),
    type: z.enum(["bug", "suggestion", "improvement", "question"]),
    application: z.enum(["web", "cli"]),
    title: z.string().min(1).max(120),
    description: z.string().nullish().default(""),
    status: z.enum(["open", "in_review", "planned", "done", "rejected"]).default("open"),
    priority: z.enum(["low", "medium", "high", "critical"]),
    pageUrl: z.string().nullish().default(""),
    userAgent: z.string().nullish().default(""),
    answer: z.string().nullish().default(""),
    createdAt: z.coerce.date().default(() => new Date()),
    updatedAt: z.coerce.date().nullish().default(null),
});

type Schema = typeof FeedbackSchema;

export type FeedbackDTO = Required<AbstractModelProps> & z.output<Schema>;

export type CreateFeedbackDTO = Omit<z.input<Schema>, "status" | "answer" | "createdAt" | "updatedAt">;

export type UpdateFeedbackDTO = Partial<Pick<z.input<Schema>, "status" | "priority" | "answer">>;
