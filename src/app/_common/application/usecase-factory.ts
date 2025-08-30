import { ActivateUserUseCase } from "@/app/users/application/use-cases/users/activate-user";
import { CreateUserUseCase } from "@/app/users/application/use-cases/users/create-user";
import { IRepositoryFactory } from "@/infra/database";
import { IMail } from "@/infra/providers/mail";

export class UseCaseFactory {
    constructor(private repositoryFactory: IRepositoryFactory, private mail: IMail) {}

    createUserUseCase() {
        return new CreateUserUseCase({ repositoryFactory: this.repositoryFactory, mail: this.mail });
    }

    activateUserUseCase() {
        return new ActivateUserUseCase({ repositoryFactory: this.repositoryFactory });
    }
}
