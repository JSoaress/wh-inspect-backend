import axios from "axios";

import { IAppConfig } from "@/infra/config/app";

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
    | { type: "queue"; queue: string; jobId?: number; status?: string; duration?: number; [key: string]: unknown }
);

export class Logger {
    constructor(private appConfig: IAppConfig) {}

    log(log: LogOptions) {
        const { message, externalId, level, error, stack, tags, ...context } = log;
        const body = { message, externalId, level, error, stack, tags, context };
        if (this.appConfig.NODE_ENV !== "production") console.log(body);
        axios
            .post(this.appConfig.LOG_MONITORING_URL, body, {
                headers: {
                    "Content-Type": "Application/json",
                    Authorization: `APIKEY ${this.appConfig.LOG_MONITORING_API_KEY}`,
                },
            })
            .catch(() => {
                console.log("[OBSERVIUM] Erro ignorado.");
            });
    }
}
