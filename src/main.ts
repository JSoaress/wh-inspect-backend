import { ApplicationFactory } from "./app/_common/application";

async function bootstrap() {
    const { server } = await ApplicationFactory.create();
    const port = 3333;
    server.listen(port, () => console.info(`Server ready and running on port ${port} with express.`));
}

bootstrap();
