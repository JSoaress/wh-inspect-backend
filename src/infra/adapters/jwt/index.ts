import { sign, verify } from "jsonwebtoken";
import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { InvalidTokenError } from "@/app/_common/errors";

type DecryptedToken<T> = {
    iat: number;
    exp?: number;
    sub: T;
};

export class JsonWebToken {
    generate(payload: string, secret: string, expiresIn?: number): string {
        if (expiresIn) return sign({}, secret, { subject: payload, expiresIn });
        return sign({}, secret, { subject: payload });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    verify<Payload = any>(token: string, secret: string): Either<InvalidTokenError, DecryptedToken<Payload>> {
        try {
            if (!token) return left(new InvalidTokenError("Token não fornecido."));
            const decrypted = verify(token, secret) as DecryptedToken<Payload>;
            return right(decrypted);
        } catch (error) {
            return left(new InvalidTokenError());
        }
    }
}
