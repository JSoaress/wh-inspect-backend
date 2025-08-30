import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { InvalidCredentialsError, InvalidUserError, MissingParamError, UseCase } from "@/app/_common";
import { JsonWebToken } from "@/infra/adapters/jwt";
import { env } from "@/shared/config/environment";

import { IUserRepository } from "../../../repos";
import {
    AuthenticateUserUseCaseGateway,
    AuthenticateUserUseCaseInput,
    AuthenticateUserUseCaseOutput,
} from "./authenticate-user.usecase.types";

export class AuthenticateUserUseCase extends UseCase<AuthenticateUserUseCaseInput, AuthenticateUserUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;
    private jwt: JsonWebToken;

    constructor({ repositoryFactory, jwt }: AuthenticateUserUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
        this.jwt = jwt;
    }

    protected async impl({ email, password }: AuthenticateUserUseCaseInput): Promise<AuthenticateUserUseCaseOutput> {
        if (!email || !password) {
            const param = !email ? "email" : "password";
            return left(new MissingParamError(param, "body"));
        }
        return this.unitOfWork.execute<AuthenticateUserUseCaseOutput>(async () => {
            const user = await this.userRepository.findOne({ filter: { email: email.toLowerCase() } });
            if (!user) return left(new InvalidCredentialsError());
            const matchPassword = await user.verifyPassword(password);
            if (!matchPassword) return left(new InvalidCredentialsError());
            if (!user.isActive) return left(new InvalidUserError());
            const accessToken = this.jwt.generate(user.email, env.JWT_TOKEN_SECRET, this.hoursToMs(4));
            return right({
                accessToken,
                user: {
                    name: user.name,
                    email: user.email,
                    cliToken: user.cliToken,
                    isActive: user.isActive,
                },
            });
        });
    }

    private hoursToMs(hours: number) {
        return hours * 60 * 60 * 1000;
    }
}
