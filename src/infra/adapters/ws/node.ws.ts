/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";

import { GetUserUseCase } from "@/app/users/application/use-cases/users/get-user";
import { MissingDependencyError } from "@/shared/errors";

import { IWebSocket } from "./ws";

export class SimpleWebSocket implements IWebSocket {
    private wss: WebSocketServer;
    private clients: Map<string, Set<WebSocket>> = new Map();
    private getUserUseCase: GetUserUseCase | undefined = undefined;

    constructor() {
        this.wss = new WebSocketServer({ noServer: true });
    }

    setGetUserUseCase(getUserUseCase: GetUserUseCase) {
        this.getUserUseCase = getUserUseCase;
    }

    start(server: Server): void {
        server.on("upgrade", (req, socket, head) => {
            this.wss.handleUpgrade(req, socket, head, async (ws) => {
                const url = new URL(req.url ?? "", `http://${req.headers.host}`);
                const cliToken = url.searchParams.get("token");
                if (!cliToken) {
                    ws.close(1008, "Token ausente");
                    return;
                }
                if (!this.getUserUseCase) throw new MissingDependencyError("GetUserUseCase");
                const userOrError = await this.getUserUseCase.execute({ filter: { cliToken } });
                if (userOrError.isLeft()) {
                    ws.close(1008, "Token inválido");
                    return;
                }
                const user = userOrError.value;
                if (!this.clients.has(cliToken)) this.clients.set(cliToken, new Set());
                this.clients.get(cliToken)?.add(ws);
                console.log(`🔗 Usuário ${user.username} conectado`);
                ws.on("close", () => {
                    this.clients.get(cliToken)?.delete(ws);
                    console.log(`❌ Usuário ${user.username} desconectado`);
                });
            });
        });
        console.log("✅ WebSocket pronto para conexões");
    }

    broadcast(userCliToken: string, message: any): void {
        const conns = this.clients.get(userCliToken);
        if (!conns) return;
        const data = JSON.stringify(message);
        conns.forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) ws.send(data);
        });
    }

    close(userCliToken: string): void {
        const conns = this.clients.get(userCliToken);
        if (!conns) return;
        conns.forEach((ws) => {
            ws.close(1000);
        });
    }
}
