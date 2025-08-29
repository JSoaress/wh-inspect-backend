import { IRepository } from "@/infra/database";

import { User, UserDTO } from "../../domain/models/user";

export type UserWhereRepository = Omit<UserDTO, "password">;

export type IUserRepository = Omit<IRepository<User, UserWhereRepository>, "destroy">;
