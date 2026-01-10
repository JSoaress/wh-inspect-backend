import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { InvalidCredentialsError, MissingParamError, UseCase } from "@/app/_common";
import { JsonWebToken } from "@/infra/adapters/jwt";
import { IAppConfig } from "@/infra/config/app";

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
    private appConfig: IAppConfig;

    constructor({ repositoryFactory, jwt, appConfig }: AuthenticateUserUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
        this.jwt = jwt;
        this.appConfig = appConfig;
    }

    protected async impl({ login, password }: AuthenticateUserUseCaseInput): Promise<AuthenticateUserUseCaseOutput> {
        if (!login || !password) {
            const param = !login ? "login" : "password";
            return left(new MissingParamError(param, "body"));
        }
        return this.unitOfWork.execute<AuthenticateUserUseCaseOutput>(async () => {
            let user = await this.userRepository.findOne({ filter: { email: login.toLowerCase() } });
            if (!user) user = await this.userRepository.findOne({ filter: { username: login } });
            if (!user) return left(new InvalidCredentialsError());
            const matchPasswordOrError = await user.verifyPassword(password);
            if (matchPasswordOrError.isLeft()) return left(matchPasswordOrError.value);
            const firstAccess = !user.lastLogin;
            const lastLoginOrError = user.registerLogin();
            if (lastLoginOrError.isLeft()) return left(lastLoginOrError.value);
            await this.userRepository.save(user);
            const accessToken = this.jwt.generate(user.email, this.appConfig.JWT_TOKEN_SECRET, this.hoursToMs(4));
            return right({
                accessToken,
                user: {
                    id: user.getId(),
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    cliToken: user.cliToken,
                    lastLogin: user.lastLogin,
                    isAdmin: user.isAdmin,
                    isActive: user.isActive,
                    firstAccess,
                },
            });
        });
    }

    private hoursToMs(hours: number) {
        return hours * 60 * 60 * 1000;
    }
}
