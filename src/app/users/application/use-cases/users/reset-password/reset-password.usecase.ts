import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";

import { IUserRepository } from "../../../repos";
import {
    ResetPasswordUseCaseGateway,
    ResetPasswordUseCaseInput,
    ResetPasswordUseCaseOutput,
} from "./reset-password.usecase.types";

export class ResetPasswordUseCase extends UseCase<ResetPasswordUseCaseInput, ResetPasswordUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;

    constructor({ repositoryFactory }: ResetPasswordUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
    }

    protected async impl({ token, newPassword }: ResetPasswordUseCaseInput): Promise<ResetPasswordUseCaseOutput> {
        return this.unitOfWork.execute<ResetPasswordUseCaseOutput>(async () => {
            const user = await this.userRepository.findOne({ filter: { userToken: token } });
            if (!user) return left(new NotFoundModelError(User.name, { userToken: token }));
            const setPasswordOrError = await user.setPassword(newPassword, token);
            if (setPasswordOrError.isLeft()) return left(setPasswordOrError.value);
            await this.userRepository.save(user);
            return right(undefined);
        });
    }
}
