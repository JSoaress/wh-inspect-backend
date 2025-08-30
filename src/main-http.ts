import http from "http";

import { UseCaseFactory } from "./app/_common/application";
import { JsonWebToken } from "./infra/adapters/jwt";
import { SimpleWebSocket } from "./infra/adapters/ws";
import { RepositoryFactory } from "./infra/database";
import { ExpressHttpServer, HttpController } from "./infra/http";
import { MailFactory } from "./infra/providers/mail";
import { env } from "./shared/config/environment";

async function bootstrap() {
    const repositoryFactory = RepositoryFactory.getRepository("postgres");
    const mail = MailFactory.getMail(env.MAIL_PROVIDER);
    const jwt = new JsonWebToken();
    const ws = new SimpleWebSocket();
    const useCaseFactory = new UseCaseFactory(repositoryFactory, mail, jwt, ws);
    ws.setGetUserUseCase(useCaseFactory.getUserUseCase());
    const httpServer = new ExpressHttpServer("/api", useCaseFactory);
    const app = httpServer.getServer();
    const server = http.createServer(app);
    ws.start(server);
    const httpController = new HttpController(httpServer);
    httpController.setup();
    const port = 3333;
    server.listen(port, () => console.info(`Server ready and running on port ${port} with express.`));
}

bootstrap();
