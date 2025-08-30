import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { MissingParamError, NotFoundModelError, UseCase } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";

import { IUserRepository } from "../../../repos";
import {
    ActivateUserUseCaseGateway,
    ActivateUserUseCaseInput,
    ActivateUserUseCaseOutput,
} from "./activate-user.usecase.types";

export class ActivateUserUseCase extends UseCase<ActivateUserUseCaseInput, ActivateUserUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;

    constructor({ repositoryFactory }: ActivateUserUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
    }

    protected async impl({ token }: ActivateUserUseCaseInput): Promise<ActivateUserUseCaseOutput> {
        if (!token) return left(new MissingParamError("token", "body"));
        return this.unitOfWork.execute<ActivateUserUseCaseOutput>(async () => {
            const user = await this.userRepository.findOne({ filter: { userToken: token } });
            if (!user) return left(new NotFoundModelError(User.name, { token }));
            const activateOrError = user.activate(token);
            if (activateOrError.isLeft()) return left(activateOrError.value);
            await this.userRepository.save(user);
            return right(undefined);
        });
    }
}
