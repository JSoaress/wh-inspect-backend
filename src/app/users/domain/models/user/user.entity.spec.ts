import { describe, expect, test } from "vitest";

import { User } from "./user.entity";
import { UserEntityFactory } from "./user.factory";

describe("user entity", () => {
    test("should create a new user", async () => {
        const userOrError = await UserEntityFactory.create({
            name: "Tony Stark",
            username: "tony",
            email: "tony@stark.com",
            password: "i_love_pepper",
        });
        expect(userOrError.isRight()).toBeTruthy();
        const user = userOrError.value as User;
        expect(user.getId()).toBeDefined();
        expect(user.name).toBe("Tony Stark");
        expect(user.username).toBe("tony");
        expect(user.email).toBe("tony@stark.com");
        expect(user.password).toBeDefined();
        expect(user.userToken?.startsWith("au")).toBeTruthy();
        expect(user.cliToken?.startsWith("cli")).toBeTruthy();
        expect(user.lastLogin).toBeNull();
        expect(user.createdAt).toBeInstanceOf(Date);
        expect(user.isAdmin).toBeFalsy();
        expect(user.isActive).toBeFalsy();
    });
});
