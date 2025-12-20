import { CreateProjectUseCase } from "@/app/projects/application/use-cases/projects/create-project";
import { DeleteProjectUseCase } from "@/app/projects/application/use-cases/projects/delete-project";
import { FetchProjectsUseCase } from "@/app/projects/application/use-cases/projects/fetch-projects";
import { ManageProjectMembersUseCase } from "@/app/projects/application/use-cases/projects/manage-project-members";
import { UpdateProjectUseCase } from "@/app/projects/application/use-cases/projects/update-project";
import { FetchSimplifiedWebhooksUseCase } from "@/app/projects/application/use-cases/webhooks/fetch-simplified-webhooks/fetch-simplified-webhooks.usecase";
import { ForwardWebhookUseCase } from "@/app/projects/application/use-cases/webhooks/forward-webhook";
import { GetWebhookUseCase } from "@/app/projects/application/use-cases/webhooks/get-webhook";
import { GetWebhookMetricsUseCase } from "@/app/projects/application/use-cases/webhooks/get-webhook-metrics";
import { ReceiveWebhookUseCase } from "@/app/projects/application/use-cases/webhooks/receive-webhook";
import { ReplayWebhookUseCase } from "@/app/projects/application/use-cases/webhooks/replay-webhook";
import { CreatePlanUseCase } from "@/app/subscription/application/use-cases/plan/create-plan";
import { DeletePlanUseCase } from "@/app/subscription/application/use-cases/plan/delete-plan";
import { FetchPlansUseCase } from "@/app/subscription/application/use-cases/plan/fetch-plans";
import { SubscribePlanUseCase } from "@/app/subscription/application/use-cases/plan/subscribe-plan";
import { UpdatePlanUseCase } from "@/app/subscription/application/use-cases/plan/update-plan";
import { CheckSubscriptionConsumptionUseCase } from "@/app/subscription/application/use-cases/subscription/check-subscription-consumption";
import { ActivateUserUseCase } from "@/app/users/application/use-cases/users/activate-user";
import { AuthenticateUserUseCase } from "@/app/users/application/use-cases/users/authenticate-user";
import { AuthenticatedUserDecorator } from "@/app/users/application/use-cases/users/authenticated-user-decorator";
import { ChangePasswordUseCase } from "@/app/users/application/use-cases/users/change-password";
import { ChangeUserCliTokenUseCase } from "@/app/users/application/use-cases/users/change-user-cli-token";
import { CheckAuthenticatedUserUseCase } from "@/app/users/application/use-cases/users/check-authenticated-user";
import { CreateUserUseCase } from "@/app/users/application/use-cases/users/create-user";
import { GetUserUseCase } from "@/app/users/application/use-cases/users/get-user";
import { ResetPasswordUseCase } from "@/app/users/application/use-cases/users/reset-password";
import { SendEmailForPasswordRecoveryUseCase } from "@/app/users/application/use-cases/users/send-email-for-password-recovery";
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

    authenticatedUserDecorator(useCase: CheckAuthenticatedUserUseCase | GetUserUseCase) {
        return new AuthenticatedUserDecorator({ repositoryFactory: this.repositoryFactory, useCase });
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

    fetchSimplifiedWebhooksUseCase() {
        return new FetchSimplifiedWebhooksUseCase({ repositoryFactory: this.repositoryFactory });
    }

    getWebhookUseCase() {
        return new GetWebhookUseCase({ repositoryFactory: this.repositoryFactory });
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

    getWebhookMetrics() {
        return new GetWebhookMetricsUseCase({ repositoryFactory: this.repositoryFactory });
    }

    fetchPlansUseCase() {
        return new FetchPlansUseCase({ repositoryFactory: this.repositoryFactory });
    }

    createPlanUseCase() {
        return new CreatePlanUseCase({ repositoryFactory: this.repositoryFactory });
    }

    updatePlanUseCase() {
        return new UpdatePlanUseCase({ repositoryFactory: this.repositoryFactory });
    }

    deletePlanUseCase() {
        return new DeletePlanUseCase({ repositoryFactory: this.repositoryFactory });
    }

    subscribePlanUseCase() {
        return new SubscribePlanUseCase({ repositoryFactory: this.repositoryFactory });
    }

    checkSubscriptionConsumption() {
        return new CheckSubscriptionConsumptionUseCase({ repositoryFactory: this.repositoryFactory });
    }

    changePasswordUseCase() {
        return new ChangePasswordUseCase({ repositoryFactory: this.repositoryFactory });
    }

    sendEmailForPasswordRecoveryUseCase() {
        return new SendEmailForPasswordRecoveryUseCase({ repositoryFactory: this.repositoryFactory, mail: this.mail });
    }

    resetPasswordUseCase() {
        return new ResetPasswordUseCase({ repositoryFactory: this.repositoryFactory });
    }

    changeUserCliTokenUseCase() {
        return new ChangeUserCliTokenUseCase({ repositoryFactory: this.repositoryFactory, ws: this.ws });
    }
}
