/* eslint-disable @typescript-eslint/no-explicit-any */
import { IQueue, QueueEvents } from "./types";

export class FakeQueue implements IQueue {
    private listeners = new Map<string, (data: any) => Promise<void>>();

    async connect(): Promise<void> {
        // empty
    }

    async close(): Promise<void> {
        // empty
    }

    async on<K extends keyof QueueEvents>(queueName: K, callback: (input: QueueEvents[K]) => Promise<void>): Promise<void> {
        if (!this.listeners.has(queueName)) this.listeners.set(queueName, callback);
    }

    async publish<K extends keyof QueueEvents>(queueName: K, data: QueueEvents[K]): Promise<void> {
        const handler = this.listeners.get(queueName);
        if (handler) await handler(data);
    }
}
