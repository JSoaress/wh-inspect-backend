import { UseCaseFactory } from "./app/_common/application";
import { JsonWebToken } from "./infra/adapters/jwt";
import { RepositoryFactory } from "./infra/database";
import { ExpressHttpServer, HttpController } from "./infra/http";
import { MailFactory } from "./infra/providers/mail";
import { env } from "./shared/config/environment";

async function bootstrap() {
    const repositoryFactory = RepositoryFactory.getRepository("postgres");
    const mail = MailFactory.getMail(env.MAIL_PROVIDER);
    const jwt = new JsonWebToken();
    const useCaseFactory = new UseCaseFactory(repositoryFactory, mail, jwt);
    const httpServer = new ExpressHttpServer("/api", useCaseFactory);
    const httpController = new HttpController(httpServer);
    httpController.setup();
    httpServer.listen(3333);
}

bootstrap();
