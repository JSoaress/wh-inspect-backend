/* eslint-disable no-await-in-loop */
import amqp, { ChannelModel } from "amqplib";

import { env } from "@/shared/config/environment";

import { Logger } from "../adapters/logger";
import { QueueConnectionError } from "./errors";
import { IQueue, QueueEvents } from "./types";

export class RabbitMQ implements IQueue {
    private connection: ChannelModel | undefined = undefined;
    private RECONNECTION_ATTEMPTS = 5;
    private RECONNECTION_DELAY = 3000;

    constructor(private logger?: Logger) {}

    async connect(): Promise<void> {
        for (let i = 0; i < this.RECONNECTION_ATTEMPTS; i += 1) {
            try {
                this.connection = await amqp.connect(env.QUEUE_URL);
                console.info("✅🐇  [RabbitMQ] Successfully connected!");
                return;
            } catch (error) {
                const err = error as Error;
                const isTimeout =
                    err.message.includes("timeout") ||
                    err.message.includes("ETIMEDOUT") ||
                    err.message.includes("ECONNREFUSED");
                if (i === this.RECONNECTION_ATTEMPTS - 1) {
                    console.info("❌🐇  [RabbitMQ] Failed to connect.");
                    if (isTimeout) throw new QueueConnectionError("Timout excedido ao tentar conectar-se ao RabbitMQ.");
                    throw error;
                }
                await new Promise((res) => {
                    setTimeout(res, this.RECONNECTION_DELAY);
                });
            }
        }
    }

    async close(): Promise<void> {
        await this.connection?.close();
    }

    async on<K extends keyof QueueEvents>(queueName: K, callback: (input: QueueEvents[K]) => Promise<void>): Promise<void> {
        if (!this.connection) throw new QueueConnectionError("Conexão com RabbitMQ não estabelecida.");
        const channel = await this.connection.createChannel();
        // await channel.prefetch(this.appConfig.QUEUE_PREFETCH); // - define quantas mensagens serão lidas por vez
        await channel.assertQueue(queueName, { durable: true });
        channel.consume(queueName, async (message) => {
            if (!message) return;

            let payload: QueueEvents[K] | null = null;
            try {
                payload = JSON.parse(message.content.toString()) as QueueEvents[K];
            } catch (error) {
                const err = error as Error;
                this.logger?.log({
                    type: "queue",
                    level: "emergency",
                    message: "Mensagem inválida (JSON)",
                    queue: queueName,
                    error: err as unknown as Record<string, unknown>,
                    stack: err.stack,
                    payload: { raw: message.content.toString() },
                });
                channel.nack(message, false, false);
                return;
            }

            try {
                await callback(payload);
            } catch (error) {
                const err = error as Error;
                this.logger?.log({
                    type: "queue",
                    level: "critical",
                    message: "Erro ao processar mensagem",
                    queue: queueName,
                    error: err as unknown as Record<string, unknown>,
                    stack: err.stack,
                    payload,
                });
            } finally {
                channel.ack(message);
            }
        });
    }

    async publish<K extends keyof QueueEvents>(queueName: K, data: QueueEvents[K]): Promise<void> {
        if (!this.connection) throw new QueueConnectionError("Conexão com RabbitMQ não estabelecida.");
        const channel = await this.connection?.createChannel();
        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
        await channel.close();
    }
}
