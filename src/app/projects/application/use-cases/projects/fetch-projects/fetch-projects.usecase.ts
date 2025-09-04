import { right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { DetailedProjectDTO, ProjectMemberDTO } from "@/app/projects/domain/models/project";
import { IUserRepository } from "@/app/users/application/repos";
import { User } from "@/app/users/domain/models/user";

import { IProjectRepository } from "../../../repos";
import {
    FetchProjectsUseCaseInput,
    FetchProjectsUseCaseOutput,
    FetchProjectsUseCaseGateway,
} from "./fetch-projects.usecase.types";

export class FetchProjectsUseCase extends UseCase<FetchProjectsUseCaseInput, FetchProjectsUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private projectRepository: IProjectRepository;
    private userRepository: IUserRepository;

    constructor({ repositoryFactory }: FetchProjectsUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.projectRepository = repositoryFactory.createProjectRepository();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.projectRepository, this.userRepository);
    }

    protected impl({ queryOptions }: FetchProjectsUseCaseInput): Promise<FetchProjectsUseCaseOutput> {
        return this.unitOfWork.execute<FetchProjectsUseCaseOutput>(async () => {
            const count = await this.projectRepository.count(queryOptions?.filter);
            const projects = await this.projectRepository.find(queryOptions);
            const memberIds = Array.from(new Set(projects.flatMap((project) => project.members)));
            const members = await this.userRepository.find({ filter: { id: { $in: memberIds } } });
            const results = projects.map<DetailedProjectDTO>(({ members: memberIds, ...project }) => {
                return {
                    ...project,
                    members: memberIds.map<ProjectMemberDTO>((id) => {
                        const m = members.find((member) => member.getId() === id) as User;
                        return { id, name: m.name };
                    }),
                };
            });
            return right({ count, results });
        });
    }
}
