import { randomUUID } from "node:crypto";
import { AbstractModel, AbstractModelProps, PrimaryKey } from "ts-arch-kit/dist/core/models";

export abstract class Entity<T extends AbstractModelProps> extends AbstractModel<T> {
    protected constructor(props: T, idGenerator: () => PrimaryKey = randomUUID) {
        super(props, !props.id, idGenerator);
    }

    getId(): string {
        return `${this.id}`;
    }

    protected updateObj(input: Partial<Omit<T, "id">>, ignore: (keyof T)[] = []) {
        Object.entries(input).forEach(([k, v]) => {
            const key = k as keyof T;
            const value = v as T[keyof T];
            if (value !== undefined && !ignore.includes(key) && this.props[key] !== value) this.props[key] = value;
        });
    }
}
