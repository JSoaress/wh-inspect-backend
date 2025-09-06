import { CreateProjectUseCase } from "@/app/projects/application/use-cases/projects/create-project";
import { DeleteProjectUseCase } from "@/app/projects/application/use-cases/projects/delete-project";
import { FetchProjectsUseCase } from "@/app/projects/application/use-cases/projects/fetch-projects";
import { ManageProjectMembersUseCase } from "@/app/projects/application/use-cases/projects/manage-project-members";
import { UpdateProjectUseCase } from "@/app/projects/application/use-cases/projects/update-project";
import { ForwardWebhookUseCase } from "@/app/projects/application/use-cases/webhooks/forward-webhook";
import { ReceiveWebhookUseCase } from "@/app/projects/application/use-cases/webhooks/receive-webhook";
import { ReplayWebhookUseCase } from "@/app/projects/application/use-cases/webhooks/replay-webhook";
import { CreatePlanUseCase } from "@/app/subscription/application/use-cases/plan/create-plan";
import { FetchPlansUseCase } from "@/app/subscription/application/use-cases/plan/fetch-plans";
import { CheckSubscriptionConsumptionUseCase } from "@/app/subscription/application/use-cases/subscription/check-subscription-consumption";
import { ActivateUserUseCase } from "@/app/users/application/use-cases/users/activate-user";
import { AuthenticateUserUseCase } from "@/app/users/application/use-cases/users/authenticate-user";
import { CheckAuthenticatedUserUseCase } from "@/app/users/application/use-cases/users/check-authenticated-user";
import { CreateUserUseCase } from "@/app/users/application/use-cases/users/create-user";
import { GetUserUseCase } from "@/app/users/application/use-cases/users/get-user";
import { JsonWebToken } from "@/infra/adapters/jwt";
import { IWebSocket } from "@/infra/adapters/ws";
import { IRepositoryFactory } from "@/infra/database";
import { IMail } from "@/infra/providers/mail";

export class UseCaseFactory {
    constructor(
        private repositoryFactory: IRepositoryFactory,
        private mail: IMail,
        private jwt: JsonWebToken,
        private ws: IWebSocket
    ) {}

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

    getUserUseCase() {
        return new GetUserUseCase({ repositoryFactory: this.repositoryFactory });
    }

    fetchProjectsUseCase() {
        return new FetchProjectsUseCase({ repositoryFactory: this.repositoryFactory });
    }

    createProjectUseCase() {
        return new CreateProjectUseCase({ repositoryFactory: this.repositoryFactory });
    }

    updateProjectUseCase() {
        return new UpdateProjectUseCase({ repositoryFactory: this.repositoryFactory });
    }

    deleteProjectUseCase() {
        return new DeleteProjectUseCase({ repositoryFactory: this.repositoryFactory });
    }

    manageProjectMembersUseCase() {
        return new ManageProjectMembersUseCase({ repositoryFactory: this.repositoryFactory });
    }

    receiveWebhookUseCase() {
        return new ReceiveWebhookUseCase({
            repositoryFactory: this.repositoryFactory,
            forwardWebhookUseCase: this.forwardWebhookUseCase(),
        });
    }

    forwardWebhookUseCase() {
        return new ForwardWebhookUseCase({ repositoryFactory: this.repositoryFactory, ws: this.ws });
    }

    replayWebhookUseCase() {
        return new ReplayWebhookUseCase({
            repositoryFactory: this.repositoryFactory,
            forwardWebhookUseCase: this.forwardWebhookUseCase(),
        });
    }

    fetchPlansUseCase() {
        return new FetchPlansUseCase({ repositoryFactory: this.repositoryFactory });
    }

    createPlanUseCase() {
        return new CreatePlanUseCase({ repositoryFactory: this.repositoryFactory });
    }

    checkSubscriptionConsumption() {
        return new CheckSubscriptionConsumptionUseCase({ repositoryFactory: this.repositoryFactory });
    }
}
