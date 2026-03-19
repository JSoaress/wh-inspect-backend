import { Router } from "express";
import { HttpStatusCodes } from "ts-arch-kit/dist/http";

import { UseCaseFactory } from "@/app/_common/application";
import { ReceiveWebhookUseCaseInput } from "@/app/projects/application/use-cases/webhooks/receive-webhook";

import { authorizationBasedUser, routeTimeout, ipLimiter } from "../../middlewares";

export function webhooksRouter(useCaseFactory: UseCaseFactory): Router {
    const router = Router();

    router.post(
        "/in/:username/:slug",
        ipLimiter,
        routeTimeout(5000),
        authorizationBasedUser(() => useCaseFactory.authenticatedUserDecorator()),
        // auditLog(factory.logger, "EVENT_RECEIVED"),
        async (req, res) => {
            const { requestUser } = req;
            const { slug } = req.params;
            const useCase = useCaseFactory.receiveWebhookUseCase();
            const input: ReceiveWebhookUseCaseInput = {
                projectSlug: slug,
                receivedFrom: req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || "unidentified",
                headers: req.headers,
                query: req.query,
                body: req.body,
                statusCodeSent: 200,
                requestUser,
            };
            await useCase.execute(input);
            // if (response.isLeft()) return next(response.value);
            return res.status(HttpStatusCodes.OK).send();
        }
    );

    return router;
}
