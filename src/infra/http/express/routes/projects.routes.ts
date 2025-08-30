import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { ExpressRouter } from "../express-router";

const projectsRoutes = new ExpressRouter("/projects", true);

projectsRoutes.register({
    method: "post",
    path: "/",
    statusCode: HttpStatusCodes.CREATED,
    useCase(factory) {
        return factory.createProjectUseCase();
    },
});

export { projectsRoutes };
