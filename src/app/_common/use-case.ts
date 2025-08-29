import { IUseCase } from "ts-arch-kit/dist/core/application";
import { BasicError } from "ts-arch-kit/dist/core/errors";
import { Either, left } from "ts-arch-kit/dist/core/helpers";

import { UnknownError } from "./errors";

export abstract class UseCase<TInput, TOutput extends Either<BasicError, unknown>> implements IUseCase<TInput, TOutput> {
    async execute(input: TInput): Promise<TOutput> {
        try {
            return this.impl(input);
        } catch (error) {
            if (error instanceof BasicError) return left(error) as TOutput;
            return left(new UnknownError(error)) as TOutput;
        }
    }

    protected abstract impl(input: TInput): Promise<TOutput>;
}
