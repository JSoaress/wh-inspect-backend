import { IPresenter } from "ts-arch-kit/dist/core/helpers";

import { User, UserDTO } from "@/app/users/domain/models/user";

type UserJson = Omit<UserDTO, "password" | "userToken">;

class UserJsonPresenter implements IPresenter<User, UserJson> {
    present(input: User): UserJson {
        return {
            id: input.getId(),
            name: input.name,
            username: input.username,
            email: input.email,
            cliToken: input.cliToken,
            createdAt: input.createdAt,
            isActive: input.isActive,
        };
    }
}

export const userJsonPresenter = new UserJsonPresenter();
