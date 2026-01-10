import { IPasswordPolicy } from "./password";
import { CreateUserDTO, RestoreUserDTO } from "./user.dto";
import { User } from "./user.entity";

function create(input: CreateUserDTO, passwordPolicy?: IPasswordPolicy) {
    return User.create(input, passwordPolicy);
}

function restore(input: RestoreUserDTO) {
    return User.restore(input);
}

export const UserEntityFactory = { create, restore };
