import { randomBytes } from "node:crypto";
import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { Entity, InvalidPasswordError, InvalidTokenError, InvalidUserError, ValidationError } from "@/app/_common";
import { ZodValidator } from "@/infra/libs/zod";

import { Password } from "./password.vo";
import { CreateUserDTO, RestoreUserDTO, UserDTO, UserSchema } from "./user.dto";

export class User extends Entity<UserDTO> {
    static async create(props: CreateUserDTO): Promise<Either<ValidationError, User>> {
        const validDataOrError = ZodValidator.validate(props, UserSchema);
        const passwordOrError = await Password.create(`${props.password}`);
        let password: Password | null = null;
        if (!validDataOrError.success || passwordOrError.isLeft()) {
            const validationError = new ValidationError(User.name, {});
            if (!validDataOrError.success) validationError.setErrors(validDataOrError.errors);
            if (passwordOrError.isLeft()) validationError.setError("password", passwordOrError.value.message);
            if (passwordOrError.isRight()) password = passwordOrError.value;
            return left(validationError);
        }
        if (!password) {
            if (passwordOrError.isLeft())
                return left(new ValidationError(User.name, { password: [passwordOrError.value.message] }));
            password = passwordOrError.value;
        }
        validDataOrError.data.cliToken = User.generateToken("cli");
        validDataOrError.data.userToken = User.generateToken("au");
        return right(new User({ ...validDataOrError.data, password }));
    }

    static restore(props: RestoreUserDTO) {
        return new User(props);
    }

    private static generateToken(prefix: string): string {
        return `${prefix}_${randomBytes(24).toString("hex")}`;
    }

    get name() {
        return this.props.name;
    }

    get username() {
        return this.props.username;
    }

    get email() {
        return this.props.email;
    }

    get password() {
        return this.props.password.getValue();
    }

    get cliToken() {
        return this.props.cliToken;
    }

    get userToken() {
        return this.props.userToken;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get isAdmin() {
        return this.props.isAdmin;
    }

    get isActive() {
        return this.props.isActive;
    }

    async verifyPassword(plainPassword: string): Promise<Either<InvalidUserError, boolean>> {
        if (!this.isActive) return left(new InvalidUserError());
        const matchPassword = await this.props.password.verify(plainPassword);
        return right(matchPassword);
    }

    async setPassword(
        plainPassword: string,
        token?: string
    ): Promise<Either<InvalidUserError | InvalidTokenError | InvalidPasswordError, void>> {
        if (!this.isActive) return left(new InvalidUserError());
        if (token && token !== this.props.userToken)
            return left(new InvalidTokenError("Token de alteração de senha é inválido."));
        const passwordOrError = await Password.create(plainPassword);
        if (passwordOrError.isLeft()) return left(passwordOrError.value);
        this.props.password = passwordOrError.value;
        this.props.userToken = null;
        return right(undefined);
    }

    putChangePasswordToken(): Either<InvalidUserError, string> {
        if (!this.isActive) return left(new InvalidUserError());
        const token = User.generateToken("cp");
        this.props.userToken = token;
        return right(token);
    }

    activate(token: string): Either<InvalidTokenError, void> {
        if (token !== this.props.userToken) return left(new InvalidTokenError("Token de ativação inválido."));
        this.props.userToken = null;
        this.props.isActive = true;
        return right(undefined);
    }
}
