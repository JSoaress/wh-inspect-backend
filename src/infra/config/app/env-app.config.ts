import envVar from "env-var";

import { IAppConfig } from "./app.config";

export class EnvAppConfig implements IAppConfig {
    NODE_ENV: string;
    PLATFORM_NAME: string;
    WEB_URL: string;
    SELF_URL: string;
    MAIL_PROVIDER: string;
    MAIL_HOST: string;
    MAIL_PORT: number;
    MAIL_USER: string;
    MAIL_PASS: string;
    JWT_TOKEN_SECRET: string;
    DB_PROVIDER: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
    LOG_MONITORING_URL: string;
    LOG_MONITORING_API_KEY: string;
    QUEUE_URL: string;

    constructor() {
        this.NODE_ENV = envVar.get("NODE_ENV").default("development").asString();
        this.PLATFORM_NAME = envVar.get("PLATFORM_NAME").default("HookHub").asString();
        this.WEB_URL = envVar.get("WEB_URL").required().asUrlString();
        this.SELF_URL = envVar.get("SELF_URL").required().asUrlString();
        this.MAIL_PROVIDER = envVar.get("MAIL_PROVIDER").required().asString();
        this.MAIL_HOST = envVar.get("MAIL_HOST").required().asString();
        this.MAIL_PORT = envVar.get("MAIL_PORT").required().asInt();
        this.MAIL_USER = envVar.get("MAIL_USER").required().asString();
        this.MAIL_PASS = envVar.get("MAIL_PASS").required().asString();
        this.JWT_TOKEN_SECRET = envVar.get("JWT_TOKEN_SECRET").required().asString();
        this.DB_PROVIDER = envVar.get("DB_PROVIDER").required().asString();
        this.DB_HOST = envVar.get("DB_HOST").required().asString();
        this.DB_PORT = envVar.get("DB_PORT").required().asInt();
        this.DB_USER = envVar.get("DB_USER").required().asString();
        this.DB_PASSWORD = envVar.get("DB_PASSWORD").required().asString();
        this.DB_DATABASE = envVar.get("DB_DATABASE").required().asString();
        this.LOG_MONITORING_URL = envVar.get("LOG_MONITORING_URL").required().asString();
        this.LOG_MONITORING_API_KEY = envVar.get("LOG_MONITORING_API_KEY").required().asString();
        this.QUEUE_URL = envVar.get("QUEUE_URL").required().asString();
    }
}
