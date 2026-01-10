import { IPasswordPolicy, StrongPasswordPolicy } from "@/app/users/domain/models/user/password/password-policy";
import { IAppConfig } from "@/infra/config/app";

export interface IPasswordPolicyProvider {
    getPolicy(): IPasswordPolicy | undefined;
}

export class PasswordPolicyProvider implements IPasswordPolicyProvider {
    constructor(private appConfig: IAppConfig) {}

    getPolicy(): IPasswordPolicy | undefined {
        if (this.appConfig.NODE_ENV === "production") return new StrongPasswordPolicy();
        return undefined;
    }
}
