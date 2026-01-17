import { ReceiveWebhookUseCaseInput } from "@/app/projects/application/use-cases/webhooks/receive-webhook";

import { ExpressHttpServer } from "../express-server.http";
import { authorizationBasedUser, checkPlanLimit, routeTimeout, ipLimiter, auditLog } from "../middlewares";

export function webhooksRouter(httpServer: ExpressHttpServer) {
    httpServer.route({
        method: "post",
        path: "/webhooks/in/:username/:slug",
        middlewares(factory) {
            return [
                ipLimiter,
                routeTimeout(5000),
                authorizationBasedUser(factory.authenticatedUserDecorator(factory.getUserUseCase())),
                auditLog(factory.logger, "EVENT_RECEIVED"),
            ];
        },
        handler: async (factory, req) => {
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
            await useCase.execute(input);
            return undefined;
        },
    });
    httpServer.route({
        method: "post",
        path: "/webhooks/:webhook/replay",
        auth: true,
        buildInput(req) {
            return { webhookLogId: req.params.webhook };
        },
        middlewares(factory) {
            return [
                checkPlanLimit("replay-event", factory.checkSubscriptionConsumption()),
                auditLog(factory.logger, "EVENT_REPLAYED"),
            ];
        },
        useCase(factory) {
            return factory.replayWebhookUseCase();
        },
    });
    httpServer.route({
        method: "get",
        path: "/webhooks/metrics",
        auth: true,
        useCase(factory) {
            return factory.getWebhookMetrics();
        },
    });
    httpServer.route({
        method: "get",
        path: "/webhooks/:webhook",
        auth: true,
        buildInput(req) {
            return { queryOptions: { filter: { id: req.params.webhook } } };
        },
        useCase(factory) {
            return factory.getWebhookUseCase();
        },
    });
}
