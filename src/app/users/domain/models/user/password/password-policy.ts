import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { InvalidPasswordError } from "@/app/_common";

export interface IPasswordPolicy {
    validate(plain: string): Either<InvalidPasswordError, true>;
}

export class StrongPasswordPolicy implements IPasswordPolicy {
    validate(plain: string): Either<InvalidPasswordError, true> {
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[^\s]{8,}$/.test(plain)) {
            const criteria = `A senha precisa conter mín. 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 caractere especial e sem espaços.`;
            return left(new InvalidPasswordError(criteria));
        }
        return right(true);
    }
}
