import { CreateUserDTO, RestoreUserDTO } from "./user.dto";
import { User } from "./user.entity";

function create(input: CreateUserDTO) {
    return User.create(input);
}

function restore(input: RestoreUserDTO) {
    return User.restore(input);
}

export const UserEntityFactory = { create, restore };
