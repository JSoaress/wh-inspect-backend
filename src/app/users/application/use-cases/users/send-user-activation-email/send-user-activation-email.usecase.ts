import { join } from "node:path";
import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";
import { IAppConfig } from "@/infra/config/app";
import { IMail } from "@/infra/providers/mail";

import { IUserRepository } from "../../../repos";
import {
    SendUserActivationEmailUseCaseGateway,
    SendUserActivationEmailUseCaseInput,
    SendUserActivationEmailUseCaseOutput,
} from "./send-user-activation-email.usecase.types";

export class SendUserActivationEmailUseCase extends UseCase<
    SendUserActivationEmailUseCaseInput,
    SendUserActivationEmailUseCaseOutput
> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;
    private mail: IMail;
    private appConfig: IAppConfig;

    constructor({ repositoryFactory, mail, appConfig }: SendUserActivationEmailUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
        this.mail = mail;
        this.appConfig = appConfig;
    }

    protected async impl({ userId }: SendUserActivationEmailUseCaseInput): Promise<SendUserActivationEmailUseCaseOutput> {
        return this.unitOfWork.execute<SendUserActivationEmailUseCaseOutput>(async () => {
            const user = await this.userRepository.findById(userId);
            if (!user) return left(new NotFoundModelError(User.name, userId));
            await Promise.all([this.sendActivationEmail(user), this.sendNewUserNotification(user)]);
            return right(undefined);
        });
    }

    async sendActivationEmail(user: User) {
        const path = join(__dirname, ...Array(6).fill(".."), "shared", "views", "emails", "activate-account.hbs");
        await this.mail.sendMail({
            to: [user.email],
            subject: `Ativação de conta ${this.appConfig.PLATFORM_NAME}`,
            template: {
                path,
                variables: {
                    platform: this.appConfig.PLATFORM_NAME,
                    name: user.name,
                    activationLink: `${this.appConfig.WEB_URL}activation-account/${user.userToken}`,
                    year: new Date().getFullYear(),
                },
            },
        });
    }

    async sendNewUserNotification(user: User) {
        await this.mail.sendMail({
            to: ["joao_vitorsgs@hotmail.com"],
            subject: `Novo usuário registrado no ${this.appConfig.PLATFORM_NAME}`,
            text: `O usuário ${user.name} (${user.username}) se registrou na plataforma.`,
        });
    }
}
