import { PrimaryKey } from "ts-arch-kit/dist/core/models";

import { PaymentMethods } from "@/app/subscription/domain/models/subscription";

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
    last_login: Date | null;
    created_at: Date;
    is_admin: boolean;
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
    source_subscription: string;
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
    source_subscription: string;
    out_of_subscription: boolean;
};

export type PgPlanDTO = PgModelId & {
    name: string;
    price: number;
    is_paid: boolean;
    tier: number;
    billing_cycle: "monthly" | "quarterly" | "annual";
    max_projects: number;
    events_month: number;
    retention: number;
    replay_events: boolean;
    support: "community" | "email" | "priority";
    created_at: Date;
    updated_at: Date | null;
    visible: boolean;
    is_active: boolean;
};

export type PgSubscriptionDTO = PgModelId & {
    user_id: string;
    plan_id: string;
    start_date: Date;
    end_date: Date | null;
    payment_method: PaymentMethods;
    last_payment: Date;
    next_payment: Date | null;
} & Pick<PgPlanDTO, "price" | "tier" | "max_projects" | "events_month" | "retention" | "replay_events" | "support">;

export type PgParameterDTO = PgModelId & {
    key: string;
    value: string;
    is_system: boolean;
};

export type PgFeedbackDTO = PgModelId & {
    user_id: string;
    type: "bug" | "suggestion" | "improvement" | "question";
    application: "web" | "cli";
    title: string;
    description: string | null;
    status: "open" | "in_review" | "planned" | "done" | "rejected";
    priority: "low" | "medium" | "high" | "critical";
    page_url: string | null;
    user_agent: string | null;
    answer: string | null;
    created_at: Date;
    updated_at: Date | null;
};

export type PgProjectUsageDTO = PgModelId & {
    project_id: string;
    year_month: string;
    max_events: number;
    events_count: number;
    updated_at: Date | null;
};
