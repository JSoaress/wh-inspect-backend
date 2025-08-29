import bcrypt from "bcrypt";
import { Either, right } from "ts-arch-kit/dist/core/helpers";

import { InvalidPasswordError } from "@/app/_common";

export class Password {
    private constructor(private value: string) {}

    static async create(plainPassword: string): Promise<Either<InvalidPasswordError, Password>> {
        // TODO: validar força da senha
        const hashPassword = await bcrypt.hash(plainPassword, 12);
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
