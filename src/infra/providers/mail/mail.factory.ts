import { IAppConfig } from "@/infra/config/app";
import { MissingDependencyError } from "@/shared/errors";

import { EtherealMail } from "./ethereal.mail";
import { IMail } from "./mail";
import { NodemailerMail } from "./nodemailer.mail";

export class MailFactory {
    static getMail(appConfig: IAppConfig): IMail {
        switch (appConfig.MAIL_PROVIDER) {
            case "ethereal":
                return new EtherealMail();
            case "nodemailer":
                return new NodemailerMail(appConfig);
            default:
                throw new MissingDependencyError("IMail");
        }
    }
}
