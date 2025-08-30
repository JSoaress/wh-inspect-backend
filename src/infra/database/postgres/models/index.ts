import { PrimaryKey } from "ts-arch-kit/dist/core/models";

type PgModelId = {
    id: PrimaryKey;
};

export type PgUserDTO = PgModelId & {
    name: string;
    username: string;
    email: string;
    password: string;
    cli_token: string;
    user_token: string | null;
    created_at: Date;
    is_active: boolean;
};

export type PgProjectDTO = PgModelId & {
    name: string;
    description: string | null;
    slug: string;
    created_at: Date;
    is_active: boolean;
    members: string;
    owner: string;
};

export type PgWebhookLogDTO = PgModelId & {
    project_id: string;
    received_from: string;
    received_at: Date;
    headers: Record<string, unknown> | null;
    body: Record<string, unknown>;
    query: Record<string, unknown> | null;
    status_code_sent: number;
    replayed_from: string | null;
    replayed_at: Date | null;
    replay_status: "success" | "fail" | null;
    target_url: string | null;
};
