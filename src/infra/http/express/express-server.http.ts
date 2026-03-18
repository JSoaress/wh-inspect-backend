import cors from "cors";
import express from "express";

export class ExpressHttpServer {
    private app: express.Express;

    constructor() {
        this.app = express();
        this.app.use(express.json({ limit: "1mb" }));
        this.app.use(cors());
        // this.app.use(helmet(opt.helmetOptions));
    }

    getServer() {
        return this.app;
    }
}
