import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { EmailTakenError, UseCase } from "@/app/_common";
import { UserEntityFactory } from "@/app/users/domain/models/user";

import { IUserRepository } from "../../../repos";
import { CreateUserUseCaseGateway, CreateUserUseCaseInput, CreateUserUseCaseOutput } from "./create-user.usecase.types";

export class CreateUserUseCase extends UseCase<CreateUserUseCaseInput, CreateUserUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;

    constructor({ repositoryFactory }: CreateUserUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
    }

    protected async impl(input: CreateUserUseCaseInput): Promise<CreateUserUseCaseOutput> {
        return this.unitOfWork.execute<CreateUserUseCaseOutput>(async () => {
            const userOrError = await UserEntityFactory.create(input);
            if (userOrError.isLeft()) return left(userOrError.value);
            const userCreated = userOrError.value;
            const emailInUse = await this.userRepository.exists({ email: userCreated.email });
            if (emailInUse) return left(new EmailTakenError(userCreated.email));
            const savedUser = await this.userRepository.save(userCreated);
            // TODO: enviar email de ativação
            return right(savedUser);
        });
    }
}
