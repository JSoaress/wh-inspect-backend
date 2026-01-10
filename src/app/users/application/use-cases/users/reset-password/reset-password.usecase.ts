import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";
import { IPasswordPolicyProvider } from "@/infra/providers/password";

import { IUserRepository } from "../../../repos";
import {
    ResetPasswordUseCaseGateway,
    ResetPasswordUseCaseInput,
    ResetPasswordUseCaseOutput,
} from "./reset-password.usecase.types";

export class ResetPasswordUseCase extends UseCase<ResetPasswordUseCaseInput, ResetPasswordUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;
    private passwordPolicyProvider: IPasswordPolicyProvider;

    constructor({ repositoryFactory, passwordPolicyProvider }: ResetPasswordUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
        this.passwordPolicyProvider = passwordPolicyProvider;
    }

    protected async impl({ token, newPassword }: ResetPasswordUseCaseInput): Promise<ResetPasswordUseCaseOutput> {
        return this.unitOfWork.execute<ResetPasswordUseCaseOutput>(async () => {
            const user = await this.userRepository.findOne({ filter: { userToken: token } });
            if (!user) return left(new NotFoundModelError(User.name, { userToken: token }));
            const passwordPolicy = this.passwordPolicyProvider.getPolicy();
            const setPasswordOrError = await user.setPassword(newPassword, passwordPolicy, token);
            if (setPasswordOrError.isLeft()) return left(setPasswordOrError.value);
            await this.userRepository.save(user);
            return right(undefined);
        });
    }
}
