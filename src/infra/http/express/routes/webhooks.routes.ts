import { ReceiveWebhookUseCaseInput } from "@/app/projects/application/use-cases/webhooks/receive-webhook";

import { ExpressRouter } from "../express-router";
import { authorizationBasedUser } from "../middlewares";

const webhooksRoutes = new ExpressRouter("/webhooks", true);

webhooksRoutes.register({
    method: "post",
    path: "/in/:user/:slug",
    auth: false,
    middlewares(factory) {
        return [authorizationBasedUser(factory.getUserByIdUseCase())];
    },
    handler: async (factory, req, res, next) => {
        const { slug } = req.params;
        const input: ReceiveWebhookUseCaseInput = {
            projectSlug: slug,
            receivedFrom: "todo",
            headers: req.headers,
            query: req.query,
            body: req.body,
            statusCodeSent: 200,
            requestUser: req.requestUser,
        };
        const useCase = factory.receiveWebhookUseCase();
        const result = await useCase.execute(input);
        if (result.isLeft()) return next(result.value);
        return undefined;
    },
});

export { webhooksRoutes };
