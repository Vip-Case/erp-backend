/*import { Elysia } from 'elysia';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'SECRET_KEY';

export const authGuard = (ctx: any) => {
    const authHeader = ctx.request?.headers?.authorization;

    if (!authHeader) {
        ctx.response.status = 401;
        throw new Error("Unauthorized: Authorization header is missing.");
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as any;
        ctx.user = {
            userId: decoded.userId,
            isAdmin: decoded.isAdmin,
            permissions: decoded.permissions,
        };
    } catch (error) {
        ctx.response.status = 403;
        throw new Error("Unauthorized: Invalid or expired token.");
    }
};

*/