import "elysia";

declare module "elysia" {
    interface Store {
        user?: {
            userId: string;
            isAdmin: boolean;
            permissions: string[];
        };
    }
}
