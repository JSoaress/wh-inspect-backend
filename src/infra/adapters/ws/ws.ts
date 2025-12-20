/* eslint-disable @typescript-eslint/no-explicit-any */
import http from "http";

export interface IWebSocket {
    start(server: http.Server): void;
    broadcast(client: "front" | "cli", userToken: string, message: any): void;
    close(userCliToken: string): void;
}
