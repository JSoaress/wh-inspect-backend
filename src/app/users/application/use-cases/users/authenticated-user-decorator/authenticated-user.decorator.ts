import { left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import { UnknownError, UseCase, UserHasNoActiveSubscriptionError } from "@/app/_common";
import { UseCaseFactory } from "@/app/_common/application";
import { ISubscriptionRepository } from "@/app/subscription/application/repos";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { ICacheProvider } from "@/infra/providers/cache";

import {
    AuthenticatedUserDecoratorGateway,
    AuthenticatedUserDecoratorInput,
    AuthenticatedUserDecoratorOutput,
} from "./authenticated-user.decorator.types";

export class AuthenticatedUserDecorator extends UseCase<AuthenticatedUserDecoratorInput, AuthenticatedUserDecoratorOutput> {
    private unitOfWork: UnitOfWork;
    private subscriptionRepository: ISubscriptionRepository;
    private cache: ICacheProvider;
    private useCaseFactory: UseCaseFactory;

    constructor({ repositoryFactory, useCaseFactory, cache }: AuthenticatedUserDecoratorGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.subscriptionRepository = repositoryFactory.createSubscriptionRepository();
        this.unitOfWork.prepare(this.subscriptionRepository);
        this.cache = cache;
        this.useCaseFactory = useCaseFactory;
    }

    protected async impl(input: AuthenticatedUserDecoratorInput): Promise<AuthenticatedUserDecoratorOutput> {
        return this.unitOfWork.execute<AuthenticatedUserDecoratorOutput>(async () => {
            if (input.type === "token") {
                const cacheKey = `authUser:${input.type}:${input.token}`;
                const cachedUser = await this.cache.get<AuthenticatedUserDTO>(cacheKey);
                if (cachedUser) return right(cachedUser);
                const useCase = this.useCaseFactory.checkAuthenticatedUserUseCase();
                const responseOrError = await useCase.execute({ token: input.token });
                if (responseOrError.isLeft()) return left(responseOrError.value);
                const user = responseOrError.value;
                const currentSubscription = await this.subscriptionRepository.getCurrentSubscriptionByUser(user);
                if (!currentSubscription) return left(new UserHasNoActiveSubscriptionError());
                const authenticatedUser: AuthenticatedUserDTO = {
                    ...user.toDto(),
                    id: user.getId(),
                    currentSubscriptionId: currentSubscription.getId(),
                };
                await this.cacheAuthenticatedUser(cacheKey, authenticatedUser);
                return right(authenticatedUser);
            }
            if (input.type === "username") {
                const cacheKey = `authUser:${input.type}:${input.username}`;
                const cachedUser = await this.cache.get<AuthenticatedUserDTO>(cacheKey);
                if (cachedUser) return right(cachedUser);
                const useCase = this.useCaseFactory.getUserUseCase();
                const responseOrError = await useCase.execute({ filter: { username: input.username } });
                if (responseOrError.isLeft()) return left(responseOrError.value);
                const user = responseOrError.value;
                const currentSubscription = await this.subscriptionRepository.getCurrentSubscriptionByUser(user);
                if (!currentSubscription) return left(new UserHasNoActiveSubscriptionError());
                const authenticatedUser: AuthenticatedUserDTO = {
                    ...user.toDto(),
                    id: user.getId(),
                    currentSubscriptionId: currentSubscription.getId(),
                };
                await this.cacheAuthenticatedUser(cacheKey, authenticatedUser);
                return right(authenticatedUser);
            }
            return left(new UnknownError("AuthenticatedUserDecorator mal configurado."));
        });
    }

    private async cacheAuthenticatedUser(key: string, authenticatedUser: AuthenticatedUserDTO) {
        await this.cache.set(key, authenticatedUser, { ttl: 60 * 60 });
    }
}
