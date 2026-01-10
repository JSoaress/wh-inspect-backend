import { right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { DetailedProjectDTO, ProjectMemberDTO } from "@/app/projects/domain/models/project";
import { ISubscriptionRepository } from "@/app/subscription/application/repos";
import { IUserRepository } from "@/app/users/application/repos";
import { User } from "@/app/users/domain/models/user";
import { IAppConfig } from "@/infra/config/app";

import { IProjectRepository } from "../../../repos";
import {
    FetchProjectsUseCaseInput,
    FetchProjectsUseCaseOutput,
    FetchProjectsUseCaseGateway,
} from "./fetch-projects.usecase.types";

export class FetchProjectsUseCase extends UseCase<FetchProjectsUseCaseInput, FetchProjectsUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private subscriptionRepository: ISubscriptionRepository;
    private projectRepository: IProjectRepository;
    private userRepository: IUserRepository;
    private appConfig: IAppConfig;

    constructor({ repositoryFactory, appConfig }: FetchProjectsUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.subscriptionRepository = repositoryFactory.createSubscriptionRepository();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.subscriptionRepository, this.projectRepository, this.userRepository);
        this.appConfig = appConfig;
    }

    protected impl({ queryOptions, requestUser }: FetchProjectsUseCaseInput): Promise<FetchProjectsUseCaseOutput> {
        return this.unitOfWork.execute<FetchProjectsUseCaseOutput>(async () => {
            const allowedSubscriptionIds = await this.subscriptionRepository.getSubscriptionsCoveredBy(
                requestUser.id,
                requestUser.currentSubscriptionId
            );
            const { filter = {} } = queryOptions || {};
            filter.owner = requestUser.id;
            const count = await this.projectRepository.count(filter);
            const projects = await this.projectRepository.find({ ...queryOptions, filter });
            if (!projects.length) return right({ count, results: [] });
            const memberIds = Array.from(new Set(projects.flatMap((project) => project.members)));
            const members = await this.userRepository.find({ filter: { id: { $in: memberIds } } });
            const results = projects.map<DetailedProjectDTO>(({ members: memberIds, ...project }) => {
                return {
                    ...project,
                    members: memberIds.map<ProjectMemberDTO>((id) => {
                        const m = members.find((member) => member.getId() === id) as User;
                        return { id, name: m.name };
                    }),
                    blocked: !allowedSubscriptionIds.some(({ id }) => id === project.sourceSubscription),
                    publicUrl: `${this.appConfig.SELF_URL}api/webhooks/in/${requestUser.username}/${project.slug}`,
                };
            });
            return right({ count, results });
        });
    }
}
