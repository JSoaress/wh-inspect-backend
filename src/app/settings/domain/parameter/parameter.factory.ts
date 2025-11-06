import { ParameterDTO, RestoreParameterDTO } from "./parameter.dto";

function restore(input: RestoreParameterDTO): ParameterDTO {
    return input;
}

export const ParameterEntityFactory = { restore };
