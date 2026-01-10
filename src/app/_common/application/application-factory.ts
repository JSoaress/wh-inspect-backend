import http from "http";

import { JsonWebToken } from "@/infra/adapters/jwt";
import { Logger } from "@/infra/adapters/logger";
import { SimpleWebSocket } from "@/infra/adapters/ws";
import { EnvAppConfig } from "@/infra/config/app";
import { RepositoryFactory } from "@/infra/database";
import { ExpressHttpServer, HttpController } from "@/infra/http";
import { MemoryCache } from "@/infra/providers/cache";
import { MailFactory } from "@/infra/providers/mail";
import { PasswordPolicyProvider } from "@/infra/providers/password";
import { RabbitMQ, QueueController } from "@/infra/queue";

import { UseCaseFactory } from "./usecase-factory";

export class ApplicationFactory {
    static async create() {
        const appConfig = new EnvAppConfig();

        // ---------- Infra ----------
        const logger = new Logger(appConfig);
        const repositoryFactory = RepositoryFactory.getRepository(appConfig);
        const mail = MailFactory.getMail(appConfig);
        const jwt = new JsonWebToken();
        const ws = new SimpleWebSocket();
        const cache = new MemoryCache();
        const queue = new RabbitMQ(appConfig, logger);
        const passwordPolicyProvider = new PasswordPolicyProvider(appConfig);

        await queue.connect();

        // ---------- Use Cases ----------
        const useCaseFactory = new UseCaseFactory(
            repositoryFactory,
            mail,
            jwt,
            ws,
            cache,
            queue,
            appConfig,
            logger,
            passwordPolicyProvider
        );

        // ---------- Controllers ----------
        const queueController = new QueueController(queue, useCaseFactory);
        queueController.setup();

        ws.setGetUserUseCase(useCaseFactory.getUserUseCase());

        const httpServer = new ExpressHttpServer("/api", appConfig, useCaseFactory);
        const app = httpServer.getServer();
        const server = http.createServer(app);

        const httpController = new HttpController(httpServer);
        httpController.setup();

        ws.start(server);

        return {
            server,
            config: appConfig,
            logger,
        };
    }
}
