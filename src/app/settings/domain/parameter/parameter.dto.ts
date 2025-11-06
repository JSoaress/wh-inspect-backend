import { RequireOnly } from "ts-arch-kit/dist/core/helpers";
import { AbstractModelProps } from "ts-arch-kit/dist/core/models";

export type ParameterDTO = AbstractModelProps & {
    key: string;
    value: string;
    isSystem: boolean;
};

export type RestoreParameterDTO = RequireOnly<ParameterDTO, "id">;
