import { BasicError } from "ts-arch-kit/dist/core/errors";
import { Either } from "ts-arch-kit/dist/core/helpers";

import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";

import { CheckAuthenticatedUserUseCase } from "../check-authenticated-user";
import { GetUserUseCase } from "../get-user";

export type AuthenticatedUserDecoratorGateway = {
    repositoryFactory: IRepositoryFactory;
    useCase: CheckAuthenticatedUserUseCase | GetUserUseCase;
};

export type AuthenticatedUserDecoratorInput =
    | {
          type: "token";
          token: string;
      }
    | {
          type: "username";
          username: string;
      };

export type AuthenticatedUserDecoratorOutput = Either<BasicError, AuthenticatedUserDTO>;
