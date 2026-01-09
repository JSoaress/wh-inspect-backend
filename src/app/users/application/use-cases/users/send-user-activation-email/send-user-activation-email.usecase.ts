import { join } from "node:path";
import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";
import { IMail } from "@/infra/providers/mail";
import { env } from "@/shared/config/environment";

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

    constructor({ repositoryFactory, mail }: SendUserActivationEmailUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
        this.mail = mail;
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
            subject: `Ativação de conta ${env.PLATFORM_NAME}`,
            template: {
                path,
                variables: {
                    platform: env.PLATFORM_NAME,
                    name: user.name,
                    activationLink: `${env.WEB_URL}activation-account/${user.userToken}`,
                    year: new Date().getFullYear(),
                },
            },
        });
    }

    async sendNewUserNotification(user: User) {
        await this.mail.sendMail({
            to: ["joao_vitorsgs@hotmail.com"],
            subject: `Novo usuário registrado no ${env.PLATFORM_NAME}`,
            text: `O usuário ${user.name} (${user.username}) se registrou na plataforma.`,
        });
    }
}
