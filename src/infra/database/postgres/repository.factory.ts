import { UnitOfWork } from "ts-arch-kit/dist/database";

import { IFeedbackRepository } from "@/app/feedbacks/application/repos";
import { IProjectRepository, IWebhookLogRepository, IWebhookUsageRepository } from "@/app/projects/application/repos";
import { IParameterRepository } from "@/app/settings/application/repos";
import { IPlanRepository, ISubscriptionRepository } from "@/app/subscription/application/repos";
import { IUserRepository } from "@/app/users/application/repos";
import { IAppConfig } from "@/infra/config/app";

import { IRepositoryFactory } from "../repository.factory";
import * as mappers from "./mappers";
import * as repos from "./repositories";

export class PgRepositoryFactory implements IRepositoryFactory {
    constructor(private appConfig: IAppConfig) {}

    createUnitOfWork(): UnitOfWork {
        return new repos.PgUnitOfWork(this.appConfig);
    }

    createUserRepository(): IUserRepository {
        return new repos.DefaultPgRepository("users", new mappers.UserPgMapper());
    }

    createProjectRepository(): IProjectRepository {
        return new repos.DefaultPgRepository("projects", new mappers.ProjectPgMapper());
    }

    createWebhookLogRepository(): IWebhookLogRepository {
        return new repos.WebhookLogPgRepository();
    }

    createPlanRepository(): IPlanRepository {
        return new repos.DefaultPgRepository("plans", new mappers.PlanPgMapper());
    }

    createSubscriptionRepository(): ISubscriptionRepository {
        return new repos.SubscriptionPgRepository();
    }

    createParameterRepository(): IParameterRepository {
        return new repos.DefaultPgRepository("parameters", new mappers.ParameterPgMapper());
    }

    createFeedbackRepository(): IFeedbackRepository {
        return new repos.DefaultPgRepository("feedbacks", new mappers.FeedbackPgMapper());
    }

    createWebhookUsageRepository(): IWebhookUsageRepository {
        return new repos.DefaultPgRepository("webhook_usage", new mappers.WebhookUsagePgMapper());
    }
}
