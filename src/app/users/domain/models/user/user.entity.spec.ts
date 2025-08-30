import { describe, expect, test } from "vitest";

import { User } from "./user.entity";
import { UserEntityFactory } from "./user.factory";

describe("user entity", () => {
    test("should create a new user", async () => {
        const userOrError = await UserEntityFactory.create({
            name: "Tony Stark",
            username: "tony",
            email: "tony@stark.com",
            password: "i_love_papper",
        });
        expect(userOrError.isRight()).toBeTruthy();
        const user = userOrError.value as User;
    });
});
