import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { MissingParamError, NotFoundModelError, UseCase } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";
import { JsonWebToken } from "@/infra/adapters/jwt";
import { IAppConfig } from "@/infra/config/app";

import { IUserRepository } from "../../../repos";
import {
    CheckAuthenticatedUserUseCaseGateway,
    CheckAuthenticatedUserUseCaseInput,
    CheckAuthenticatedUserUseCaseOutput,
} from "./check-authenticated-user.usecase.types";

export class CheckAuthenticatedUserUseCase extends UseCase<
    CheckAuthenticatedUserUseCaseInput,
    CheckAuthenticatedUserUseCaseOutput
> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;
    private jwt: JsonWebToken;
    private appConfig: IAppConfig;

    constructor({ repositoryFactory, jwt, appConfig }: CheckAuthenticatedUserUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
        this.jwt = jwt;
        this.appConfig = appConfig;
    }

    protected async impl({ token }: CheckAuthenticatedUserUseCaseInput): Promise<CheckAuthenticatedUserUseCaseOutput> {
        if (!token) return left(new MissingParamError("token", "body"));
        return this.unitOfWork.execute<CheckAuthenticatedUserUseCaseOutput>(async () => {
            const decryptedTokenOrError = this.jwt.verify<string>(token, this.appConfig.JWT_TOKEN_SECRET);
            if (decryptedTokenOrError.isLeft()) return left(decryptedTokenOrError.value);
            const decryptedToken = decryptedTokenOrError.value;
            const user = await this.userRepository.findOne({ filter: { email: decryptedToken.sub } });
            if (!user) return left(new NotFoundModelError(User.name, { email: decryptedToken.sub }));
            return right(user);
        });
    }
}
