import { describe, expect, test } from "vitest";

import { RepositoryFactory } from "@/infra/database";
import { MailFactory } from "@/infra/providers/mail";

import { CreateUserUseCase } from "./create-user.usecase";

describe("create user use case", () => {
    test("should save a new user", async () => {
        const repositoryFactory = RepositoryFactory.getRepository("postgres");
        const mail = MailFactory.getMail("ethereal");
        const useCase = new CreateUserUseCase({ repositoryFactory, mail });
        const result = await useCase.execute({
            name: "Tony Stark",
            username: "tony",
            email: "tony@stark.com",
            password: "i_love_papper",
        });
        console.log(result.value);
        expect(result.isRight()).toBeTruthy();
    });
});
