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
                email: { columnName: "email", type: "string" },
                password: { columnName: "password", type: "string" },
                cliToken: { columnName: "cli_token", type: "string" },
                userToken: { columnName: "user_token", type: "string" },
                createdAt: { columnName: "created_at", type: "date" },
                isActive: { columnName: "is_active", type: "boolean" },
            },
        };
    }

    toDomain(persistence: PgUserDTO): User {
        return UserEntityFactory.restore({
            id: persistence.id,
            name: persistence.name,
            email: persistence.email,
            password: Password.restore(persistence.password),
            cliToken: persistence.cli_token,
            userToken: persistence.user_token,
            createdAt: persistence.created_at,
            isActive: persistence.is_active,
        });
    }

    toPersistence(entity: User): Partial<PgUserDTO> {
        return {
            id: entity.getId(),
            name: entity.isNew || entity.checkDirtyProps("name") ? entity.name : undefined,
            email: entity.isNew || entity.checkDirtyProps("email") ? entity.email : undefined,
            password: entity.isNew || entity.checkDirtyProps("password") ? entity.password : undefined,
            cli_token: entity.isNew || entity.checkDirtyProps("cliToken") ? entity.cliToken : undefined,
            user_token: entity.isNew || entity.checkDirtyProps("userToken") ? entity.userToken : undefined,
            created_at: entity.isNew || entity.checkDirtyProps("createdAt") ? entity.createdAt : undefined,
            is_active: entity.isNew || entity.checkDirtyProps("isActive") ? entity.isActive : undefined,
        };
    }
}
