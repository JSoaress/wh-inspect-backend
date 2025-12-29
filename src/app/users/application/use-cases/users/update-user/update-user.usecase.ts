import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { NotFoundModelError, UseCase } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";

import { IUserRepository } from "../../../repos";
import { UpdateUserUseCaseGateway, UpdateUserUseCaseInput, UpdateUserUseCaseOutput } from "./update-user.usecase.types";

export class UpdateUserUseCase extends UseCase<UpdateUserUseCaseInput, UpdateUserUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;

    constructor({ repositoryFactory }: UpdateUserUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
    }

    protected impl({ requestUser, ...input }: UpdateUserUseCaseInput): Promise<UpdateUserUseCaseOutput> {
        return this.unitOfWork.execute<UpdateUserUseCaseOutput>(async () => {
            const user = await this.userRepository.findById(requestUser.id);
            if (!user) return left(new NotFoundModelError(User.name, requestUser.id));
            const updateOrError = user.update({
                ...input,
                isAdmin: requestUser.isAdmin ? input.isAdmin : requestUser.isAdmin,
            });
            if (updateOrError.isLeft()) return left(updateOrError.value);
            const updatedUser = await this.userRepository.save(user);
            return right(updatedUser);
        });
    }
}
