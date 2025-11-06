import nodemailer, { Transporter } from "nodemailer";

import { env } from "@/shared/config/environment";

import { Mail, SendMailOptions } from "./mail";

export class NodemailerMail extends Mail {
    private client: Transporter;

    constructor() {
        super();
        this.client = nodemailer.createTransport({
            host: env.MAIL_HOST,
            port: env.MAIL_PORT,
            secure: env.MAIL_PORT === 465,
            auth: {
                user: env.MAIL_USER,
                pass: env.MAIL_PASS,
            },
        });
    }

    async sendMail({ to, subject, template }: SendMailOptions): Promise<void> {
        let templateHTML: string | undefined;
        if (template) templateHTML = this.compileTemplate(template.path, template.variables || {});
        await this.client?.sendMail({
            to,
            from: `Admin <${env.MAIL_USER}>`,
            subject,
            html: templateHTML,
        });
    }
}
