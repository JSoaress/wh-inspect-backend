import { Either, left, right } from "ts-arch-kit/dist/core/helpers";
import { UnitOfWork } from "ts-arch-kit/dist/database";

import {
    MissingParamError,
    NotFoundModelError,
    SystemParameterNotConfiguredError,
    UndefinedFreemiumPlanError,
    UseCase,
    ValidationError,
} from "@/app/_common";
import { IParameterRepository } from "@/app/settings/application/repos";
import { IPlanRepository, ISubscriptionRepository } from "@/app/subscription/application/repos";
import { User } from "@/app/users/domain/models/user";

import { IUserRepository } from "../../../repos";
import {
    ActivateUserUseCaseGateway,
    ActivateUserUseCaseInput,
    ActivateUserUseCaseOutput,
} from "./activate-user.usecase.types";

type CreateSubscriptionToUserOutput = Either<
    SystemParameterNotConfiguredError | UndefinedFreemiumPlanError | ValidationError,
    void
>;

export class ActivateUserUseCase extends UseCase<ActivateUserUseCaseInput, ActivateUserUseCaseOutput> {
    private unitOfWork: UnitOfWork;
    private userRepository: IUserRepository;
    private parameterRepository: IParameterRepository;
    private planRepository: IPlanRepository;
    private subscriptionRepository: ISubscriptionRepository;

    constructor({ repositoryFactory }: ActivateUserUseCaseGateway) {
        super();
        this.unitOfWork = repositoryFactory.createUnitOfWork();
        this.userRepository = repositoryFactory.createUserRepository();
        this.parameterRepository = repositoryFactory.createParameterRepository();
        this.planRepository = repositoryFactory.createPlanRepository();
        this.subscriptionRepository = repositoryFactory.createSubscriptionRepository();
        this.unitOfWork.prepare(
            this.userRepository,
            this.parameterRepository,
            this.planRepository,
            this.subscriptionRepository
        );
    }

    protected async impl({ token }: ActivateUserUseCaseInput): Promise<ActivateUserUseCaseOutput> {
        if (!token) return left(new MissingParamError("token", "body"));
        return this.unitOfWork.execute<ActivateUserUseCaseOutput>(async () => {
            const user = await this.userRepository.findOne({ filter: { userToken: token } });
            if (!user) return left(new NotFoundModelError(User.name, { token }));
            const activateOrError = user.activate(token);
            if (activateOrError.isLeft()) return left(activateOrError.value);
            const activatedUser = await this.userRepository.save(user);
            const subscriptionOrError = await this.createSubscriptionToUser(activatedUser);
            if (subscriptionOrError.isLeft()) return left(subscriptionOrError.value);
            return right(undefined);
        });
    }

    private async createSubscriptionToUser(user: User): Promise<CreateSubscriptionToUserOutput> {
        const parameter = await this.parameterRepository.findOne({ filter: { key: "subscription.plan.freemium" } });
        if (!parameter) return left(new SystemParameterNotConfiguredError("subscription.plan.freemium"));
        const plan = await this.planRepository.findById(parameter.value);
        if (!plan) return left(new UndefinedFreemiumPlanError());
        const subscriptionOrError = plan.subscribe(user, "free");
        if (subscriptionOrError.isLeft()) return left(subscriptionOrError.value);
        await this.subscriptionRepository.save(subscriptionOrError.value);
        return right(undefined);
    }
}
