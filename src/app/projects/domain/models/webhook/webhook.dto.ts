import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { z } from "@/infra/libs/zod";

import { ProjectDTO } from "../project";

export const WebHookLogSchema = z.object({
    projectId: z.uuid(),
    receivedFrom: z.coerce.string(),
    receivedAt: z.coerce.date().default(() => new Date()),
    headers: z.record(z.string(), z.any()).nullish().default(null),
    body: z.record(z.string(), z.any()),
    query: z.record(z.string(), z.any()).nullish().default(null),
    statusCodeSent: z.coerce.number().int().nonnegative(),
    replayedFrom: z.string().nullish().default(null),
    replayedAt: z.coerce.date().nullish().default(null),
    replayStatus: z.enum(["success", "fail"]).nullish().default(null),
    targetUrl: z.coerce.string().nullish().default(null),
    sourceSubscription: z.uuid(),
});

type Schema = typeof WebHookLogSchema;

export type WebHookLogDTO = Required<AbstractModelProps> & z.output<Schema>;

export type CreateWebHookLogDTO = z.input<Schema>;

export type SimplifiedWebhook = Pick<WebHookLogDTO, "id" | "receivedFrom" | "receivedAt" | "replayedAt"> & {
    project: Pick<ProjectDTO, "id" | "name">;
};
