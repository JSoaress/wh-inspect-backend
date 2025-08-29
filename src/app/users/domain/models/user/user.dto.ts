import { RequireOnly } from "ts-arch-kit/dist/core/helpers";
import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

import { z } from "@/infra/libs/zod";

import { Password } from "./password.vo";

export const UserSchema = z.object({
    name: z.coerce.string().max(30),
    email: z.email(),
    password: z.coerce.string(),
    cliToken: z.coerce.string().default(""),
    userToken: z.coerce.string().nullish().default(null),
    createdAt: z.coerce.date().default(() => new Date()),
    isActive: z.coerce.boolean().default(false),
});

type Schema = typeof UserSchema;

export type UserDTO = AbstractModelProps & Omit<z.output<Schema>, "password"> & { password: Password };

export type CreateUserDTO = Omit<z.input<Schema>, "cliToken" | "userToken" | "createdAt" | "isActive">;

export type RestoreUserDTO = RequireOnly<UserDTO, "id">;
