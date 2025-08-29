import nodemailer, { Transporter } from "nodemailer";

import { Mail, SendMailOptions } from "./mail";

export class EtherealMail extends Mail {
    async sendMail({ to, subject, template }: SendMailOptions): Promise<void> {
        let templateHTML: string | undefined;
        if (template) templateHTML = this.compileTemplate(template.path, template.variables || {});
        const client = await this.createTransporter();
        const message = await client.sendMail({
            to,
            from: "Admin <noreply@observium.com.br>",
            subject,
            html: templateHTML,
        });
        console.log("Message sent: %s", message?.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
    }

    private async createTransporter(): Promise<Transporter> {
        const account = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass,
            },
        });
        return transporter;
    }
}
