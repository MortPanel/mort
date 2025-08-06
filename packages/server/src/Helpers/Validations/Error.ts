import { ZodError } from "zod";

export function ErrorStyle(error: ZodError) {
    const errors: Record<string, { errors: { code: string; message: string }[] }> = {};

    error.issues.forEach((e) => {
        const path = e.path.join(".") || "body";
        if (!errors[path]) errors[path] = { errors: [] };

        errors[path].errors.push({
            code: e.code.toUpperCase(),
            message: e.message
        });
    });

    return {
        success: false,
        message: "Bad Request",
        errors
    };
}

export function PterodactylErrorStyle(error: {errors: {code: string; detail: string; meta?: { source_field?: string } }[]}) {
    const errors: Record<string, { errors: { code: string; message: string }[] }> = {};

    error.errors.forEach((e) => {
        const path = e.meta?.source_field || "body";
        if (!errors[path]) errors[path] = { errors: [] };

        errors[path].errors.push({
            code: e.code.toUpperCase(),
            message: e.detail
        });
    });

    return errors;
}