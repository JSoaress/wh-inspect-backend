import envVar from "env-var";

export const env = {
    NODE_ENV: envVar.get("NODE_ENV").default("development").asString(),
    PLATFORM_NAME: envVar.get("PLATFORM_NAME").default("WebhookInspec").asString(),
    WEB_URL: envVar.get("WEB_URL").required().asUrlString(),
    MAIL_PROVIDER: envVar.get("MAIL_PROVIDER").required().asString(),
    MAIL_HOST: envVar.get("MAIL_HOST").required().asString(),
    MAIL_PORT: envVar.get("MAIL_PORT").required().asInt(),
    MAIL_USER: envVar.get("MAIL_USER").required().asString(),
    MAIL_PASS: envVar.get("MAIL_PASS").required().asString(),
};
