import * as z from "zod/v4";

z.config(z.locales.pt());

type SuccessResult<T> = {
    success: true;
    data: T;
};

type ErrorResult = {
    success: false;
    errors: Record<string, string[]>;
};

type ResultValidate<T> = SuccessResult<T> | ErrorResult;

export class ZodValidator {
    static validate<I, O>(props: unknown, schema: z.ZodType<O, I>): ResultValidate<O> {
        const result = schema.safeParse(props);
        if (result.success) return { success: true, data: result.data };
        const errors: Record<string, string[]> = {};
        result.error.issues.forEach((issue) => {
            const path = issue.path.join(".");
            if (errors[path]) errors[path].push(issue.message);
            else errors[path] = [issue.message];
        });
        return { success: false, errors };
    }
}

export { z };
