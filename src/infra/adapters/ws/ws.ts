/* eslint-disable @typescript-eslint/no-explicit-any */
import http from "http";

export interface IWebSocket {
    start(server: http.Server): void;
    broadcast(cliUserToken: string, message: any): void;
}
