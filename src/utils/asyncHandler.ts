// src/utils/asyncHandler.ts

export const asyncHandler = (fn: Function) => {
    return async (...args: any[]) => {
        try {
            return await fn(...args);
        } catch (error) {
            // Hatayı yeniden fırlatın veya CustomError fırlatın
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(String(error));
            }
        }
    }
}
