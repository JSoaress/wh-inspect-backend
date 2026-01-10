import nodemailer, { Transporter } from "nodemailer";

import { IAppConfig } from "@/infra/config/app";

import { Mail, SendMailOptions } from "./mail";

export class NodemailerMail extends Mail {
    private client: Transporter;

    constructor(private appConfig: IAppConfig) {
        super();
        this.client = nodemailer.createTransport({
            host: this.appConfig.MAIL_HOST,
            port: this.appConfig.MAIL_PORT,
            secure: this.appConfig.MAIL_PORT === 465,
            auth: {
                user: this.appConfig.MAIL_USER,
                pass: this.appConfig.MAIL_PASS,
            },
        });
    }

    async sendMail({ to, subject, text, template }: SendMailOptions): Promise<void> {
        let templateHTML: string | undefined;
        if (template) templateHTML = this.compileTemplate(template.path, template.variables || {});
        await this.client?.sendMail({
            to,
            from: `Admin <${this.appConfig.MAIL_USER}>`,
            subject,
            text,
            html: templateHTML,
        });
    }
}
