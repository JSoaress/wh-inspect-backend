import { ParameterDTO, ParameterEntityFactory } from "@/app/settings/domain/parameter";

import { DbFilterOptions } from "../../helpers";
import { IDbMapper } from "../db-mapper";
import { PgParameterDTO } from "../models";

export class ParameterPgMapper implements IDbMapper<ParameterDTO, PgParameterDTO> {
    filterOptions: DbFilterOptions;
    _isNew = false;
    _isDirty = false;

    constructor() {
        this.filterOptions = {
            columns: {
                id: { columnName: "id", type: "string" },
                key: { columnName: "key", type: "string" },
                value: { columnName: "value", type: "string" },
                isSystem: { columnName: "is_system", type: "boolean" },
            },
        };
    }

    toDomain(persistence: PgParameterDTO): ParameterDTO {
        return ParameterEntityFactory.restore({
            id: persistence.id,
            key: persistence.key,
            value: persistence.value,
            isSystem: persistence.is_system,
        });
    }

    toPersistence(entity: ParameterDTO): Partial<PgParameterDTO> {
        return {
            id: entity.id,
            key: entity.key,
            value: entity.value,
            is_system: entity.isSystem,
        };
    }
}
