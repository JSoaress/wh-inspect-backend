import envVar from "env-var";

export const env = {
    NODE_ENV: envVar.get("NODE_ENV").default("development").asString(),
    PLATFORM_NAME: envVar.get("PLATFORM_NAME").default("HookHub").asString(),
    WEB_URL: envVar.get("WEB_URL").required().asUrlString(),
    SELF_URL: envVar.get("SELF_URL").required().asUrlString(),
    MAIL_PROVIDER: envVar.get("MAIL_PROVIDER").required().asString(),
    MAIL_HOST: envVar.get("MAIL_HOST").required().asString(),
    MAIL_PORT: envVar.get("MAIL_PORT").required().asInt(),
    MAIL_USER: envVar.get("MAIL_USER").required().asString(),
    MAIL_PASS: envVar.get("MAIL_PASS").required().asString(),
    JWT_TOKEN_SECRET: envVar.get("JWT_TOKEN_SECRET").required().asString(),
    DB_HOST: envVar.get("DB_HOST").required().asString(),
    DB_PORT: envVar.get("DB_PORT").required().asInt(),
    DB_USER: envVar.get("DB_USER").required().asString(),
    DB_PASSWORD: envVar.get("DB_PASSWORD").required().asString(),
    DB_DATABASE: envVar.get("DB_DATABASE").required().asString(),
};
