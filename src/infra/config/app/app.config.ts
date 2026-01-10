export interface IAppConfig {
    readonly NODE_ENV: string;
    readonly PLATFORM_NAME: string;
    readonly WEB_URL: string;
    readonly SELF_URL: string;
    readonly MAIL_PROVIDER: string;
    readonly MAIL_HOST: string;
    readonly MAIL_PORT: number;
    readonly MAIL_USER: string;
    readonly MAIL_PASS: string;
    readonly JWT_TOKEN_SECRET: string;
    readonly DB_PROVIDER: string;
    readonly DB_HOST: string;
    readonly DB_PORT: number;
    readonly DB_USER: string;
    readonly DB_PASSWORD: string;
    readonly DB_DATABASE: string;
    readonly LOG_MONITORING_URL: string;
    readonly LOG_MONITORING_API_KEY: string;
    readonly QUEUE_URL: string;
}
