import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UseCase } from "@/app/_common";
import { User } from "@/app/users/domain/models/user";
import { IWebSocket } from "@/infra/adapters/ws";

import { IUserRepository } from "../../../repos";
import {
    ChangeUserCliTokenUseCaseGateway,
    ChangeUserCliTokenUseCaseInput,
    ChangeUserCliTokenUseCaseOutput,
} from "./change-user-cli-token.usecase.types";

export class ChangeUserCliTokenUseCase extends UseCase<ChangeUserCliTokenUseCaseInput, ChangeUserCliTokenUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;
    private ws: IWebSocket;

    constructor({ repositoryFactory, ws }: ChangeUserCliTokenUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.unitOfWork.prepare(this.userRepository);
        this.ws = ws;
    }

    protected async impl({ requestUser }: ChangeUserCliTokenUseCaseInput): Promise<ChangeUserCliTokenUseCaseOutput> {
        return this.unitOfWork.execute<ChangeUserCliTokenUseCaseOutput>(async () => {
            const { cliToken: oldCliToken } = requestUser;
            this.ws.close(oldCliToken);
            const user = User.restore(requestUser);
            const newCliTokenOrError = user.generateCliToken();
            if (newCliTokenOrError.isLeft()) return left(newCliTokenOrError.value);
            const newCliToken = newCliTokenOrError.value;
            await this.userRepository.save(user);
            return right({ newCliToken });
        });
    }
}
