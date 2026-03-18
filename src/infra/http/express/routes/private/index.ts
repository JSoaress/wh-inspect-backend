import { Router } from "express";

import { UseCaseFactory } from "@/app/_common/application";

import { feedbackRouter } from "./feedbacks.routes";
import { plansRouter } from "./plans.routes";
import { projectsRouter } from "./projects.routes";
import { usersRouter } from "./users.routes";
import { webhooksRouter } from "./webhooks.routes";

export function privateRouter(useCaseFactory: UseCaseFactory): Router {
    const router = Router();

    router.use("/feedbacks", feedbackRouter(useCaseFactory));
    router.use("/plans", plansRouter(useCaseFactory));
    router.use("/projects", projectsRouter(useCaseFactory));
    router.use("/users", usersRouter(useCaseFactory));
    router.use("/webhooks", webhooksRouter(useCaseFactory));

    return router;
}
