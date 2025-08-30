import { Password, User, UserEntityFactory } from "@/app/users/domain/models/user";

import { DbFilterOptions } from "../../helpers";
import { IDbMapper } from "../db-mapper";
import { PgUserDTO } from "../models";

export class UserPgMapper implements IDbMapper<User, PgUserDTO> {
    readonly filterOptions: DbFilterOptions;

    constructor() {
        this.filterOptions = {
            columns: {
                id: { columnName: "id", type: "string" },
                name: { columnName: "name", type: "string" },
                username: { columnName: "username", type: "string" },
                email: { columnName: "email", type: "string" },
                password: { columnName: "password", type: "string" },
                cliToken: { columnName: "cli_token", type: "string" },
                userToken: { columnName: "user_token", type: "string" },
                createdAt: { columnName: "created_at", type: "date" },
                isAdmin: { columnName: "is_admin", type: "boolean" },
                isActive: { columnName: "is_active", type: "boolean" },
            },
        };
    }

    toDomain(persistence: PgUserDTO): User {
        return UserEntityFactory.restore({
            id: persistence.id,
            name: persistence.name,
            username: persistence.username,
            email: persistence.email,
            password: Password.restore(persistence.password),
            cliToken: persistence.cli_token,
            userToken: persistence.user_token,
            createdAt: persistence.created_at,
            isAdmin: persistence.is_admin,
            isActive: persistence.is_active,
        });
    }

    toPersistence(entity: User): Partial<PgUserDTO> {
        return {
            id: entity.getId(),
            name: entity.isNew || entity.checkDirtyProps("name") ? entity.name : undefined,
            username: entity.isNew || entity.checkDirtyProps("username") ? entity.username : undefined,
            email: entity.isNew || entity.checkDirtyProps("email") ? entity.email : undefined,
            password: entity.isNew || entity.checkDirtyProps("password") ? entity.password : undefined,
            cli_token: entity.isNew || entity.checkDirtyProps("cliToken") ? entity.cliToken : undefined,
            user_token: entity.isNew || entity.checkDirtyProps("userToken") ? entity.userToken : undefined,
            created_at: entity.isNew || entity.checkDirtyProps("createdAt") ? entity.createdAt : undefined,
            is_admin: entity.isNew || entity.checkDirtyProps("isAdmin") ? entity.isAdmin : undefined,
            is_active: entity.isNew || entity.checkDirtyProps("isActive") ? entity.isActive : undefined,
        };
    }
}
