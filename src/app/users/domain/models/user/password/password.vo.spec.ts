import { describe, expect, test } from "vitest";

import { InvalidPasswordError } from "@/app/_common";

import { StrongPasswordPolicy } from "./password-policy";
import { Password } from "./password.vo";

describe("password value object", () => {
    test("should create a new password", async () => {
        const passwordOrError = await Password.create("any_pass");
        expect(passwordOrError.isRight()).toBeTruthy();
        const password = passwordOrError.value as Password;
        expect(password.getValue()).not.toBe("any_pass");
        expect(password.getValue().startsWith("$2b$12")).toBeTruthy();
    });

    test("should not create a password (empty password)", async () => {
        const passwordOrError = await Password.create("");
        expect(passwordOrError.isLeft()).toBeTruthy();
        expect(passwordOrError.value).toEqual(new InvalidPasswordError("Senha não fornecida."));
    });

    test("should create a password by validating its strength.", async () => {
        const passwordPolicy = new StrongPasswordPolicy();
        const passwordOrError = await Password.create("y5s2B`9M", { policy: passwordPolicy, hashRounds: 13 });
        expect(passwordOrError.isRight()).toBeTruthy();
        const password = passwordOrError.value as Password;
        expect(password.getValue()).not.toBe("y5s2B`9M");
        expect(password.getValue().startsWith("$2b$13")).toBeTruthy();
    });

    test.each(["7z1I7|8", '7peod56"', "W971!\\{=", "}=YErwm+", "MkC45v0S"])(
        "should not create a password if do not meet the criteria",
        async (plain) => {
            const passwordPolicy = new StrongPasswordPolicy();
            const passwordOrError = await Password.create(plain, { policy: passwordPolicy });
            expect(passwordOrError.isLeft()).toBeTruthy();
            expect(passwordOrError.value).toEqual(
                new InvalidPasswordError(
                    `A senha precisa conter mín. 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 caractere especial e sem espaços.`
                )
            );
        }
    );

    test("should validate an created password", async () => {
        const password = Password.restore("$2b$12$YuQF6PymFox2giEyXbgu3.nRcN8GSFJeuSaPwMW4DLXSsTJ6D17..");
        const match = await password.verify("y5s2B`9M");
        expect(match).toBeTruthy();
    });

    test("should not validate passwords that do not match", async () => {
        const password = Password.restore("$2b$12$YuQF6PymFox2giEyXbgu3.nRcN8GSFJeuSaPwMW4DLXSsTJ6D17..");
        const match = await password.verify("my_strong_pass");
        expect(match).toBeFalsy();
    });
});
