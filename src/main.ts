import http from "http";

import { UseCaseFactory } from "./app/_common/application";
import { JsonWebToken } from "./infra/adapters/jwt";
import { Logger } from "./infra/adapters/logger";
import { SimpleWebSocket } from "./infra/adapters/ws";
import { EnvAppConfig } from "./infra/config/app";
import { RepositoryFactory } from "./infra/database";
import { ExpressHttpServer, HttpController } from "./infra/http";
import { MemoryCache } from "./infra/providers/cache";
import { MailFactory } from "./infra/providers/mail";
import { QueueController, RabbitMQ } from "./infra/queue";

async function bootstrap() {
    const appConfig = new EnvAppConfig();
    const repositoryFactory = RepositoryFactory.getRepository(appConfig);
    const logger = new Logger(appConfig);
    const mail = MailFactory.getMail(appConfig);
    const jwt = new JsonWebToken();
    const ws = new SimpleWebSocket();
    const cache = new MemoryCache();
    const queue = new RabbitMQ(appConfig, logger);
    await queue.connect();
    const useCaseFactory = new UseCaseFactory(repositoryFactory, mail, jwt, ws, cache, queue, appConfig, logger);
    const queueController = new QueueController(queue, useCaseFactory);
    queueController.setup();
    ws.setGetUserUseCase(useCaseFactory.getUserUseCase());
    const httpServer = new ExpressHttpServer("/api", appConfig, useCaseFactory);
    const app = httpServer.getServer();
    const server = http.createServer(app);
    ws.start(server);
    const httpController = new HttpController(httpServer);
    httpController.setup();
    const port = 3333;
    server.listen(port, () => console.info(`Server ready and running on port ${port} with express.`));
}

bootstrap();
