import { IPasswordPolicy } from "./password-policy";

export type PasswordProps = {
    hashRounds?: number;
    policy?: IPasswordPolicy;
};
