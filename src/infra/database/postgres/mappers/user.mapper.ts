import { Password, User, UserEntityFactory } from "@/app/users/domain/models/user";

import { DbFilterOptions } from "../../helpers";
import { DbMapper } from "../db-mapper";
import { PgUserDTO } from "../models";

export class UserPgMapper extends DbMapper<User, PgUserDTO> {
    filterOptions: DbFilterOptions<User> = {
        columns: {
            id: { columnName: "id" },
            name: { columnName: "name" },
            username: { columnName: "username" },
            email: { columnName: "email" },
            password: {
                columnName: "password",
                toDomain: (u: PgUserDTO) => Password.restore(u.password),
                toPersistence: (u: User) => u.password,
            },
            cliToken: { columnName: "cli_token" },
            userToken: { columnName: "user_token" },
            lastLogin: { columnName: "last_login" },
            createdAt: { columnName: "created_at" },
            isAdmin: { columnName: "is_admin" },
            isActive: { columnName: "is_active" },
        },
    };

    constructor() {
        super(UserEntityFactory.restore);
    }
}
