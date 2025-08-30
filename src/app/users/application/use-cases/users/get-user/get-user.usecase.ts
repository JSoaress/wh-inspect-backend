import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";

import { IUserRepository } from "../../../repos";
import { GetUserUseCaseGateway, GetUserUseCaseInput, GetUserUseCaseOutput } from "./get-user.usecase.types";

export class GetUserUseCase extends UseCase<GetUserUseCaseInput, GetUserUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;

    constructor({ repositoryFactory }: GetUserUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
    }

    protected async impl({ filter }: GetUserUseCaseInput): Promise<GetUserUseCaseOutput> {
        return this.unitOfWork.execute<GetUserUseCaseOutput>(async () => {
            const user = await this.userRepository.findOne({ filter });
            if (!user) {
                const findById = filter.id && Object.keys(filter).length === 1;
                if (findById) return left(new NotFoundModelError(User.name, filter.id));
                return left(new NotFoundModelError(User.name, filter));
            }
            return right(user);
        });
    }
}
