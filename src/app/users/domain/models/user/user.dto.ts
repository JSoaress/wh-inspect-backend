import { RequireOnly } from "ts-arch-kit/dist/core/helpers";
import { AbstractModelProps, PrimaryKey } from "ts-arch-kit/dist/core/models";

import { z } from "@/infra/libs/zod";

import { Password } from "./password";

export const UserSchema = z.object({
    name: z.coerce.string().max(50),
    username: z
        .string()
        .max(20)
        .regex(/^[a-zA-Z0-9_]+$/, "Informe apenas letras, dígitos '_'."),
    email: z.email(),
    password: z.coerce.string(),
    cliToken: z.coerce.string().default(""),
    userToken: z.coerce.string().nullish().default(null),
    lastLogin: z.date().nullish().default(null),
    createdAt: z.coerce.date().default(() => new Date()),
    isAdmin: z.coerce.boolean().default(false),
    isActive: z.coerce.boolean().default(false),
});

type Schema = typeof UserSchema;

export type UserDTO = AbstractModelProps & Omit<z.output<Schema>, "password"> & { password: Password };

export type CreateUserDTO = Omit<z.input<Schema>, "cliToken" | "userToken" | "lastLogin" | "createdAt" | "isActive">;

export type UpdateUserDTO = Partial<Pick<CreateUserDTO, "name" | "isAdmin">>;

export type RestoreUserDTO = RequireOnly<UserDTO, "id">;

export type AuthenticatedUserDTO = RestoreUserDTO & {
    currentSubscriptionId: PrimaryKey;
};
