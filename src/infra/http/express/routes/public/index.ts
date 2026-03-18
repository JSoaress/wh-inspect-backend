import { Router } from "express";

import { UseCaseFactory } from "@/app/_common/application";

import { authRouter } from "./auth.routes";
import { usersRouter } from "./users.routes";
import { webhooksRouter } from "./webhooks.routes";

export function publicRouter(useCaseFactory: UseCaseFactory): Router {
    const router = Router();

    router.use("/auth", authRouter(useCaseFactory));
    router.use("/users", usersRouter(useCaseFactory));
    router.use("/webhooks", webhooksRouter(useCaseFactory));

    return router;
}
