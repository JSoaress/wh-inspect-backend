import bcrypt from "bcrypt";
import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { InvalidPasswordError } from "@/app/_common";
import { env } from "@/shared/config/environment";

export class Password {
    private constructor(private value: string) {}

    static async create(plainPassword: string): Promise<Either<InvalidPasswordError, Password>> {
        if (!plainPassword) return left(new InvalidPasswordError("Senha não fornecida."));
        if (env.NODE_ENV === "production" && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[^\s]{8,}$/.test(plainPassword)) {
            const criteria = `A senha precisa conter mín. 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 caractere especial e sem espaços.`;
            return left(new InvalidPasswordError(criteria));
        }
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
