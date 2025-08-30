import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { MissingParamError, NotFoundModelError, UseCase } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";

import { IUserRepository } from "../../../repos";
import {
    GetUserByIdUseCaseGateway,
    GetUserByIdUseCaseInput,
    GetUserByIdUseCaseOutput,
} from "./get-user-by-id.usecase.types";

export class GetUserByIdUseCase extends UseCase<GetUserByIdUseCaseInput, GetUserByIdUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;

    constructor({ repositoryFactory }: GetUserByIdUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
    }

    protected async impl({ id }: GetUserByIdUseCaseInput): Promise<GetUserByIdUseCaseOutput> {
        if (!id) return left(new MissingParamError("id"));
        return this.unitOfWork.execute<GetUserByIdUseCaseOutput>(async () => {
            const user = await this.userRepository.findById(id);
            if (!user) return left(new NotFoundModelError(User.name, id));
            return right(user);
        });
    }
}
