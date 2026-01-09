import { SendUserActivationEmailUseCaseInput } from "@/app/users/application/use-cases/users/send-user-activation-email";

export type QueueEvents = {
    sendUserActivationEmail: SendUserActivationEmailUseCaseInput;
};

export interface IQueue {
    connect(): Promise<void>;
    close(): Promise<void>;
    on<K extends keyof QueueEvents>(queueName: K, callback: (input: QueueEvents[K]) => Promise<void>): Promise<void>;
    publish<K extends keyof QueueEvents>(queueName: K, data: QueueEvents[K]): Promise<void>;
}
