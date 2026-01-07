/* eslint-disable max-classes-per-file */
import { IPresenter } from "ts-arch-kit/dist/core/helpers";

import { Plan, PlanDTO } from "@/app/subscription/domain/models/plan";
import { User, UserDTO } from "@/app/users/domain/models/user";

type UserJson = Omit<UserDTO, "password" | "userToken" | "isAdmin">;

class UserJsonPresenter implements IPresenter<User, UserJson> {
    present(input: User): UserJson {
        return {
            id: input.getId(),
            name: input.name,
            username: input.username,
            email: input.email,
            cliToken: input.cliToken,
            lastLogin: input.lastLogin,
            createdAt: input.createdAt,
            isActive: input.isActive,
        };
    }
}

export const userJsonPresenter = new UserJsonPresenter();

type PlanJson = PlanDTO;

class PlanJsonPresenter implements IPresenter<Plan, PlanJson> {
    present(input: Plan): PlanJson {
        return {
            id: input.getId(),
            name: input.name,
            price: input.price,
            isPaid: input.isPaid,
            tier: input.tier,
            billingCycle: input.billingCycle,
            maxProjects: input.maxProjects,
            eventsMonth: input.eventsMonth,
            retention: input.retention,
            replayEvents: input.replayEvents,
            support: input.support,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
            visible: input.visible,
            isActive: input.isActive,
        };
    }
}

export const planJsonPresenter = new PlanJsonPresenter();
