import bcrypt from "bcrypt";
import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { InvalidPasswordError } from "@/app/_common";

import { PasswordProps } from "./types";

export class Password {
    private constructor(private value: string) {}

    static async create(plainPassword: string, props?: PasswordProps): Promise<Either<InvalidPasswordError, Password>> {
        if (!plainPassword) return left(new InvalidPasswordError("Senha não fornecida."));
        if (props?.policy) {
            const isValidOrError = props.policy.validate(plainPassword);
            if (isValidOrError.isLeft()) return left(isValidOrError.value);
        }
        const hashPassword = await bcrypt.hash(plainPassword, props?.hashRounds || 12);
        return right(new Password(hashPassword));
    }

    static restore(password: string) {
        return new Password(password);
    }

    async verify(plainPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, this.value);
    }

    getValue() {
        return this.value;
    }
}
