import { BasicError } from "ts-arch-kit/dist/core/errors";
import { Either } from "ts-arch-kit/dist/core/helpers";

import { UseCaseFactory } from "@/app/_common/application";
import { AuthenticatedUserDTO } from "@/app/users/domain/models/user";
import { IRepositoryFactory } from "@/infra/database";
import { ICacheProvider } from "@/infra/providers/cache";

export type AuthenticatedUserDecoratorGateway = {
    repositoryFactory: IRepositoryFactory;
    cache: ICacheProvider;
    useCaseFactory: UseCaseFactory;
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
