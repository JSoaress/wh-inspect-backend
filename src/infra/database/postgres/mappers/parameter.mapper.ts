import { ParameterDTO, ParameterEntityFactory } from "@/app/settings/domain/parameter";

import { DbFilterOptions } from "../../helpers";
import { DbMapper } from "../db-mapper";
import { PgParameterDTO } from "../models";

export class ParameterPgMapper extends DbMapper<ParameterDTO, PgParameterDTO> {
    filterOptions: DbFilterOptions<ParameterDTO> = {
        columns: {
            id: { columnName: "id" },
            key: { columnName: "key" },
            value: { columnName: "value" },
            isSystem: { columnName: "is_system" },
        },
    };

    constructor() {
        super(ParameterEntityFactory.restore);
    }
}
