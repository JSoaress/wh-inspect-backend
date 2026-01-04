import { randomUUID } from "node:crypto";
import { uuidv7 } from "uuidv7";

export class UUID {
    static generate(version: "v4" | "v7") {
        if (version === "v7") return uuidv7();
        return randomUUID();
    }
}
