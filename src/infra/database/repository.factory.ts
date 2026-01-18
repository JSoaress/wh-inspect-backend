import { UnitOfWork } from "ts-arch-kit/dist/database";

import { IFeedbackRepository } from "@/app/feedbacks/application/repos";
import { IProjectRepository, IWebhookLogRepository, IWebhookUsageRepository } from "@/app/projects/application/repos";
import { IParameterRepository } from "@/app/settings/application/repos";
import { IPlanRepository, ISubscriptionRepository } from "@/app/subscription/application/repos";
import { IUserRepository } from "@/app/users/application/repos";
import { MissingDependencyError } from "@/shared/errors";

import { IAppConfig } from "../config/app";
import { PgRepositoryFactory } from "./postgres/repository.factory";

export interface IRepositoryFactory {
    createUnitOfWork(): UnitOfWork;
    createUserRepository(): IUserRepository;
    createProjectRepository(): IProjectRepository;
    createWebhookLogRepository(): IWebhookLogRepository;
    createPlanRepository(): IPlanRepository;
    createSubscriptionRepository(): ISubscriptionRepository;
    createParameterRepository(): IParameterRepository;
    createFeedbackRepository(): IFeedbackRepository;
    createWebhookUsageRepository(): IWebhookUsageRepository;
}

export class RepositoryFactory {
    static getRepository(appConfig: IAppConfig): IRepositoryFactory {
        switch (appConfig.DB_PROVIDER) {
            case "postgres":
                return new PgRepositoryFactory(appConfig);
            default:
                throw new MissingDependencyError("IRepositoryFactory");
        }
    }
}
