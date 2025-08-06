export type APIError = Record<string, {
    errors: { 
        code: string;
        message: string;
    }[];
}>;