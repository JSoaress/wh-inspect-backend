import { Either, left, right } from "ts-arch-kit/dist/core/helpers";

import { Entity, ValidationError } from "@/app/_common";
import { ZodValidator } from "@/infra/libs/zod";

import { CreateProjectUsageDTO, ProjectUsageDTO, ProjectUsageSchema, RestoreProjectUsageDTO } from "./project-usage.dto";

export class ProjectUsage extends Entity<ProjectUsageDTO> {
    private constructor(props: ProjectUsageDTO) {
        super(props, () => 0);
    }

    static create(props: CreateProjectUsageDTO): Either<ValidationError, ProjectUsage> {
        const validDataOrError = ZodValidator.validate(props, ProjectUsageSchema);
        if (!validDataOrError.success) return left(new ValidationError(ProjectUsage.name, validDataOrError.errors));
        return right(new ProjectUsage(validDataOrError.data));
    }

    static restore(props: RestoreProjectUsageDTO) {
        return new ProjectUsage(props);
    }

    get projectId() {
        return this.props.projectId;
    }

    get year() {
        return this.props.year;
    }

    get month() {
        return this.props.month;
    }

    get maxEvents() {
        return this.props.maxEvents;
    }

    get eventsCount() {
        return this.props.eventsCount;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    count() {
        this.props.eventsCount += 1;
        this.props.updatedAt = new Date();
    }

    canReceiveEvent() {
        return this.maxEvents > this.eventsCount;
    }
}
