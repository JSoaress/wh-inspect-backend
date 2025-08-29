import { MissingDependencyError } from "@/shared/errors";

import { EtherealMail } from "./ethereal.mail";
import { IMail } from "./mail";
import { NodemailerMail } from "./nodemailer.mail";

export class MailFactory {
    static getMail(provider: string): IMail {
        switch (provider) {
            case "ethereal":
                return new EtherealMail();
            case "nodemailer":
                return new NodemailerMail();
            default:
                throw new MissingDependencyError("IMail");
        }
    }
}
