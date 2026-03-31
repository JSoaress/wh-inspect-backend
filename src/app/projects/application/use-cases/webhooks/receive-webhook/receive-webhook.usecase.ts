import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { RequestLimitExceededError, UseCase } from "@/app/_common";
import { ICacheProvider } from "@/infra/providers/cache";
import { IQueue } from "@/infra/queue";

import {
    ReceiveWebhookUseCaseGateway,
    ReceiveWebhookUseCaseInput,
    ReceiveWebhookUseCaseOutput,
} from "./receive-webhook.usecase.types";

export class ReceiveWebhookUseCase extends UseCase<ReceiveWebhookUseCaseInput, ReceiveWebhookUseCaseOutput> {
    private cache: ICacheProvider;
    private queue: IQueue;

    constructor({ cache, queue }: ReceiveWebhookUseCaseGateway) {
        super();
        this.cache = cache;
        this.queue = queue;
    }

    protected async impl(input: ReceiveWebhookUseCaseInput): Promise<ReceiveWebhookUseCaseOutput> {
        const projectRateOrError = await this.checkProjectRate(input.projectSlug);
        if (projectRateOrError.isLeft()) return left(projectRateOrError.value);
        await this.queue.publish("saveWebhook", input);
        return right(undefined);
    }

    private async checkProjectRate(projectSlug: string): Promise<Either<RequestLimitExceededError, void>> {
        const cacheKey = `webhook:rate:${projectSlug}`;
        const count = await this.cache.increment(cacheKey, { ttl: 60 });
        if (count > 300) return left(new RequestLimitExceededError());
        return right(undefined);
    }
}
