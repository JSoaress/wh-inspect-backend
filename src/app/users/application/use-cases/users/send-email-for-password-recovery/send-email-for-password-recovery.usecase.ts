import { join } from "node:path";
import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";
import { IAppConfig } from "@/infra/config/app";
import { IMail } from "@/infra/providers/mail";

import { IUserRepository } from "../../../repos";
import {
    SendEmailForPasswordRecoveryUseCaseGateway,
    SendEmailForPasswordRecoveryUseCaseInput,
    SendEmailForPasswordRecoveryUseCaseOutput,
} from "./send-email-for-password-recovery.usecase.types";

export class SendEmailForPasswordRecoveryUseCase extends UseCase<
    SendEmailForPasswordRecoveryUseCaseInput,
    SendEmailForPasswordRecoveryUseCaseOutput
> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;
    private mail: IMail;
    private appConfig: IAppConfig;

    constructor({ repositoryFactory, mail, appConfig }: SendEmailForPasswordRecoveryUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
        this.mail = mail;
        this.appConfig = appConfig;
    }

    protected async impl({
        email,
    }: SendEmailForPasswordRecoveryUseCaseInput): Promise<SendEmailForPasswordRecoveryUseCaseOutput> {
        return this.unitOfWork.execute<SendEmailForPasswordRecoveryUseCaseOutput>(async () => {
            const user = await this.userRepository.findOne({ filter: { email } });
            if (!user) return left(new NotFoundModelError(User.name, { email }));
            const tokenOrError = user.putChangePasswordToken();
            if (tokenOrError.isLeft()) return left(tokenOrError.value);
            await this.userRepository.save(user);
            const path = join(__dirname, ...Array(6).fill(".."), "shared", "views", "emails", "password-recovery.hbs");
            await this.mail.sendMail({
                to: [user.email],
                subject: `Recuperação de senha ${this.appConfig.PLATFORM_NAME}`,
                template: {
                    path,
                    variables: {
                        platform: this.appConfig.PLATFORM_NAME,
                        name: user.name,
                        recoveryLink: `${this.appConfig.WEB_URL}password-recovery/change-password/${user.userToken}`,
                        year: new Date().getFullYear(),
                    },
                },
            });
            return right(undefined);
        });
    }
}
