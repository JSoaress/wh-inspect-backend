import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { EmailTakenError, UseCase, UsernameTakenError } from "@/app/_common";
import { UserEntityFactory } from "@/app/users/domain/models/user";
import { IQueue } from "@/infra/queue";

import { IUserRepository } from "../../../repos";
import { CreateUserUseCaseGateway, CreateUserUseCaseInput, CreateUserUseCaseOutput } from "./create-user.usecase.types";

export class CreateUserUseCase extends UseCase<CreateUserUseCaseInput, CreateUserUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;
    private queue: IQueue;

    constructor({ repositoryFactory, queue }: CreateUserUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
        this.queue = queue;
    }

    protected async impl(input: CreateUserUseCaseInput): Promise<CreateUserUseCaseOutput> {
        const response = await this.unitOfWork.execute<CreateUserUseCaseOutput>(async () => {
            const userOrError = await UserEntityFactory.create(input);
            if (userOrError.isLeft()) return left(userOrError.value);
            const userCreated = userOrError.value;
            const emailInUse = await this.userRepository.exists({ email: userCreated.email });
            if (emailInUse) return left(new EmailTakenError(userCreated.email));
            const usernameInUse = await this.userRepository.exists({ username: userCreated.username });
            if (usernameInUse) return left(new UsernameTakenError(userCreated.username));
            const savedUser = await this.userRepository.save(userCreated);
            return right(savedUser);
        });
        if (response.isRight()) await this.queue.publish("sendUserActivationEmail", { userId: response.value.getId() });
        return response;
    }
}
