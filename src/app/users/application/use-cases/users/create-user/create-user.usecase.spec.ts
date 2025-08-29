import { describe, expect, test } from "vitest";

import { RepositoryFactory } from "@/infra/database";

import { CreateUserUseCase } from "./create-user.usecase";

describe("create user use case", () => {
    test("should save a new user", async () => {
        const repositoryFactory = RepositoryFactory.getRepository("postgres");
        const useCase = new CreateUserUseCase({ repositoryFactory });
        const result = await useCase.execute({
            name: "Tony Stark",
            email: "tony2@stark.com",
            password: "i_love_papper",
        });
        console.log(result.value);
        expect(result.isRight()).toBeTruthy();
    });
});
