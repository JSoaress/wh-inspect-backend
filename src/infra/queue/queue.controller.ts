import { UseCaseFactory } from "@/app/_common/application";

import { IQueue } from "./types";

export class QueueController {
    constructor(private queue: IQueue, private useCaseFactory: UseCaseFactory) {}

    setup(): void {
        this.queue.on("sendUserActivationEmail", async (input) => {
            const useCase = this.useCaseFactory.sendUserActivationEmail();
            const response = await useCase.execute(input);
            if (response.isLeft()) throw response.value;
        });
    }
}
