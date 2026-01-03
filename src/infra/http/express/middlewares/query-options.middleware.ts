import { Request, Response, NextFunction } from "express";
import { parseNumber } from "ts-arch-kit/dist/core/helpers";
import { QueryOptions } from "ts-arch-kit/dist/database";

import { HttpFilterTranslatorError } from "@/shared/errors";

export function queryOptions(req: Request, res: Response, next: NextFunction) {
    const { skip, limit, sort = "", ...filters } = req.query;
    const queryOptions: QueryOptions = {
        pagination: { skip: parseNumber(skip, 0), limit: parseNumber(limit, 30) },
        sort: [],
        filter: {},
    };
    const regexp = new RegExp(`[${[",", ";"].join("")}]`);
    const filterArr = Object.entries<string>(filters as Record<string, string>);
    for (let index = 0; index < filterArr.length; index += 1) {
        const [k, v] = filterArr[index];
        try {
            const [field, operator = "exact"] = k.split("__");
            if (operator === "jsonExact")
                queryOptions.filter = { ...queryOptions.filter, [field]: { [`$${operator}`]: JSON.parse(v) } };
            if (operator === "jsonExists")
                queryOptions.filter = { ...queryOptions.filter, [field]: { [`$${operator}`]: v.split(".") } };
            if (operator === "jsonHasAll" || operator === "jsonHasAny")
                queryOptions.filter = { ...queryOptions.filter, [field]: { [`$${operator}`]: v.split(regexp) } };
            if (operator === "jsonIn")
                queryOptions.filter = {
                    ...queryOptions.filter,
                    [field]: { [`$${operator}`]: v.split(regexp).map((v) => JSON.parse(v)) },
                };
            if (!operator.startsWith("json"))
                queryOptions.filter = { ...queryOptions.filter, [field]: { [`$${operator}`]: v } };
        } catch (error) {
            console.log(error);
            return next(new HttpFilterTranslatorError(k, v));
        }
    }
    // sort=-name,birthDate;-age
    const sortClauses = (sort as string).split(regexp);
    sortClauses
        .filter(Boolean)
        .filter((s) => s !== "-")
        .forEach((clause) => {
            if (clause.startsWith("-")) queryOptions.sort?.push({ column: clause.substring(1), order: "desc" });
            else queryOptions.sort?.push({ column: clause, order: "asc" });
        });
    req.queryOptions = queryOptions;
    return next();
}
