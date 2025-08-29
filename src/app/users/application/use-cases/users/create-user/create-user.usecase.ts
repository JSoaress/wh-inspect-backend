import { join } from "node:path";
import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { EmailTakenError, UseCase } from "@/app/_common";
import { User, UserEntityFactory } from "@/app/users/domain/models/user";
import { IMail } from "@/infra/providers/mail";
import { env } from "@/shared/config/environment";

import { IUserRepository } from "../../../repos";
import { CreateUserUseCaseGateway, CreateUserUseCaseInput, CreateUserUseCaseOutput } from "./create-user.usecase.types";

export class CreateUserUseCase extends UseCase<CreateUserUseCaseInput, CreateUserUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;
    private mail: IMail;

    constructor({ repositoryFactory, mail }: CreateUserUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
        this.mail = mail;
    }

    protected async impl(input: CreateUserUseCaseInput): Promise<CreateUserUseCaseOutput> {
        return this.unitOfWork.execute<CreateUserUseCaseOutput>(async () => {
            const userOrError = await UserEntityFactory.create(input);
            if (userOrError.isLeft()) return left(userOrError.value);
            const userCreated = userOrError.value;
            const emailInUse = await this.userRepository.exists({ email: userCreated.email });
            if (emailInUse) return left(new EmailTakenError(userCreated.email));
            const savedUser = await this.userRepository.save(userCreated);
            await this.sendActivationEmail(savedUser);
            return right(savedUser);
        });
    }

    async sendActivationEmail(savedUser: User) {
        await this.mail.sendMail({
            to: [savedUser.email],
            subject: `Ativação de conta ${env.PLATFORM_NAME}`,
            template: {
                path: join(process.cwd(), "src", "shared", "views", "emails", "activate-account.hbs"),
                variables: {
                    platform: env.PLATFORM_NAME,
                    name: savedUser.name,
                    activationLink: `${env.WEB_URL}activation-account/${savedUser.userToken}`,
                    year: new Date().getFullYear(),
                },
            },
        });
    }
}
