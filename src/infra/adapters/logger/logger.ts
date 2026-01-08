import axios from "axios";

import { env } from "@/shared/config/environment";

type LogOptions = {
    message: string;
    externalId?: string;
    level: string;
    error?: Record<string, unknown>;
    stack?: string;
    tags?: string[];
} & (
    | { type: "http"; method: string; url: string; status: number; duration?: number }
    | { type: "other"; [key: string]: unknown }
);

export class Logger {
    log(log: LogOptions) {
        const { message, externalId, level, error, stack, tags, ...context } = log;
        const body = { message, externalId, level, error, stack, tags, context };
        if (env.NODE_ENV !== "production") console.log(body);
        axios
            .post(env.LOG_MONITORING_URL, body, {
                headers: {
                    "Content-Type": "Application/json",
                    Authorization: `APIKEY ${env.LOG_MONITORING_API_KEY}`,
                },
            })
            .catch(() => {
                console.log("[OBSERVIUM] Erro ignorado.");
            });
    }
}

export const logger = new Logger();
