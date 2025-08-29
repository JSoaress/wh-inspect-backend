import { UnitOfWork } from "ts-arch-kit/dist/database";

import { IProjectRepository, IWebhookLogRepository } from "@/app/projects/application/repos";
import { IUserRepository } from "@/app/users/application/repos";

import { PgRepositoryFactory } from "./postgres/repository.factory";

export interface IRepositoryFactory {
    createUnitOfWork(): UnitOfWork;
    createUserRepository(): IUserRepository;
    createProjectRepository(): IProjectRepository;
    createWebhookLogRepository(): IWebhookLogRepository;
}

export class RepositoryFactory {
    static getRepository(provider: string): IRepositoryFactory {
        switch (provider) {
            case "postgres":
                return new PgRepositoryFactory();
            default:
                throw new Error("Implementar");
        }
    }
}
