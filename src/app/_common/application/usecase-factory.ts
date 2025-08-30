import { CreateProjectUseCase } from "@/app/projects/application/use-cases/projects/create-project";
import { ActivateUserUseCase } from "@/app/users/application/use-cases/users/activate-user";
import { AuthenticateUserUseCase } from "@/app/users/application/use-cases/users/authenticate-user";
import { CheckAuthenticatedUserUseCase } from "@/app/users/application/use-cases/users/check-authenticated-user";
import { CreateUserUseCase } from "@/app/users/application/use-cases/users/create-user";
import { JsonWebToken } from "@/infra/adapters/jwt";
import { IRepositoryFactory } from "@/infra/database";
import { IMail } from "@/infra/providers/mail";

export class UseCaseFactory {
    constructor(private repositoryFactory: IRepositoryFactory, private mail: IMail, private jwt: JsonWebToken) {}

    createUserUseCase() {
        return new CreateUserUseCase({ repositoryFactory: this.repositoryFactory, mail: this.mail });
    }

    activateUserUseCase() {
        return new ActivateUserUseCase({ repositoryFactory: this.repositoryFactory });
    }

    authenticateUserUseCase() {
        return new AuthenticateUserUseCase({ repositoryFactory: this.repositoryFactory, jwt: this.jwt });
    }

    checkAuthenticatedUserUseCase() {
        return new CheckAuthenticatedUserUseCase({ repositoryFactory: this.repositoryFactory, jwt: this.jwt });
    }

    createProjectUseCase() {
        return new CreateProjectUseCase({ repositoryFactory: this.repositoryFactory });
    }
}
