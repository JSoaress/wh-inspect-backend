import { randomUUID } from "node:crypto";
import { AbstractModel, AbstractModelProps, PrimaryKey } from "ts-arch-kit/dist/core/models";

export abstract class Entity<T extends AbstractModelProps> extends AbstractModel<T> {
    protected constructor(props: T, idGenerator: () => PrimaryKey = randomUUID) {
        super(props, !props.id, idGenerator);
    }

    getId(): string {
        return `${this.id}`;
    }
}
