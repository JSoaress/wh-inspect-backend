import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { InvalidCredentialsError, UseCase } from "@/app/_common";

import { IUserRepository } from "../../../repos";
import {
    ChangePasswordUseCaseGateway,
    ChangePasswordUseCaseInput,
    ChangePasswordUseCaseOutput,
} from "./change-password.usecase.types";

export class ChangePasswordUseCase extends UseCase<ChangePasswordUseCaseInput, ChangePasswordUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;

    constructor({ repositoryFactory }: ChangePasswordUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
    }

    protected async impl(input: ChangePasswordUseCaseInput): Promise<ChangePasswordUseCaseOutput> {
        return this.unitOfWork.execute<ChangePasswordUseCaseOutput>(async () => {
            const { currentPassword, newPassword, requestUser } = input;
            const matchPasswordOrError = await requestUser.verifyPassword(currentPassword);
            if (matchPasswordOrError.isLeft()) return left(matchPasswordOrError.value);
            if (!matchPasswordOrError.value) return left(new InvalidCredentialsError());
            const setPasswordOrError = await requestUser.setPassword(newPassword);
            if (setPasswordOrError.isLeft()) return left(setPasswordOrError.value);
            await this.userRepository.save(requestUser);
            return right(undefined);
        });
    }
}
