import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UnknownError, UseCase, UserHasNoActiveSubscriptionError } from "@/app/_common";
import { ISubscriptionRepository } from "@/app/subscription/application/repos";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";

import { CheckAuthenticatedUserUseCase } from "../check-authenticated-user";
import { GetUserUseCase } from "../get-user";
import {
    AuthenticatedUserDecoratorGateway,
    AuthenticatedUserDecoratorInput,
    AuthenticatedUserDecoratorOutput,
} from "./authenticated-user.decorator.types";

export class AuthenticatedUserDecorator extends UseCase<AuthenticatedUserDecoratorInput, AuthenticatedUserDecoratorOutput> {
    private unitOfWork: UnitOfWork;
    private subscriptionRepository: ISubscriptionRepository;
    private useCase: CheckAuthenticatedUserUseCase | GetUserUseCase;

    constructor({ repositoryFactory, useCase }: AuthenticatedUserDecoratorGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.subscriptionRepository = repositoryFactory.createSubscriptionRepository();
        this.unitOfWork.prepare(this.subscriptionRepository);
        this.useCase = useCase;
    }

    protected async impl(input: AuthenticatedUserDecoratorInput): Promise<AuthenticatedUserDecoratorOutput> {
        return this.unitOfWork.execute<AuthenticatedUserDecoratorOutput>(async () => {
            if (input.type === "token" && this.useCase instanceof CheckAuthenticatedUserUseCase) {
                const responseOrError = await this.useCase.execute({ token: input.token });
                if (responseOrError.isLeft()) return left(responseOrError.value);
                const user = responseOrError.value;
                const currentSubscription = await this.subscriptionRepository.getCurrentSubscriptionByUser(user);
                if (!currentSubscription) return left(new UserHasNoActiveSubscriptionError());
                return right({
                    ...user.toDto(),
                    currentSubscriptionId: currentSubscription.getId(),
                } as AuthenticatedUserDTO);
            }
            if (input.type === "username" && this.useCase instanceof GetUserUseCase) {
                const responseOrError = await this.useCase.execute({ filter: { username: input.username } });
                if (responseOrError.isLeft()) return left(responseOrError.value);
                const user = responseOrError.value;
                const currentSubscription = await this.subscriptionRepository.getCurrentSubscriptionByUser(user);
                if (!currentSubscription) return left(new UserHasNoActiveSubscriptionError());
                return right({
                    ...user.toDto(),
                    currentSubscriptionId: currentSubscription.getId(),
                } as AuthenticatedUserDTO);
            }
            return left(new UnknownError("AuthenticatedUserDecorator mal configurado."));
        });
    }
}
