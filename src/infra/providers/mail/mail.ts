import handlebars from "handlebars";
import fs from "node:fs";

export type SendMailOptions = {
    to: string[];
    subject: string;
    template?: {
        path: string;
        variables?: Record<string, unknown>;
    };
};

export interface IMail {
    sendMail(opt: SendMailOptions): Promise<void>;
}

export abstract class Mail implements IMail {
    abstract sendMail(opt: SendMailOptions): Promise<void>;

    protected compileTemplate(path: string, variables: Record<string, unknown>) {
        const templateFileContent = fs.readFileSync(path).toString("utf-8");
        const templateParse = handlebars.compile(templateFileContent);
        return templateParse(variables);
    }
}
