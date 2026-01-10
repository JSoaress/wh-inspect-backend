import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";
import { IPasswordPolicyProvider } from "@/infra/providers/password";

import { IUserRepository } from "../../../repos";
import {
    ChangePasswordUseCaseGateway,
    ChangePasswordUseCaseInput,
    ChangePasswordUseCaseOutput,
} from "./change-password.usecase.types";

export class ChangePasswordUseCase extends UseCase<ChangePasswordUseCaseInput, ChangePasswordUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;
    private passwordPolicyProvider: IPasswordPolicyProvider;

    constructor({ repositoryFactory, passwordPolicyProvider }: ChangePasswordUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
        this.passwordPolicyProvider = passwordPolicyProvider;
    }

    protected async impl(input: ChangePasswordUseCaseInput): Promise<ChangePasswordUseCaseOutput> {
        return this.unitOfWork.execute<ChangePasswordUseCaseOutput>(async () => {
            const { currentPassword, newPassword, requestUser } = input;
            const user = User.restore(requestUser);
            const matchPasswordOrError = await user.verifyPassword(currentPassword);
            if (matchPasswordOrError.isLeft()) return left(matchPasswordOrError.value);
            const passwordPolicy = this.passwordPolicyProvider.getPolicy();
            const setPasswordOrError = await user.setPassword(newPassword, passwordPolicy);
            if (setPasswordOrError.isLeft()) return left(setPasswordOrError.value);
            await this.userRepository.save(user);
            return right(undefined);
        });
    }
}
