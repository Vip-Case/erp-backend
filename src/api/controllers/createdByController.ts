import { Context } from 'elysia';
import jwt from 'jsonwebtoken';
import { CreatedByService } from '../../services/concrete/createdByService';

const SECRET_KEY = process.env.JWT_SECRET || 'SECRET_KEY';

export const createdByController = {
    async create(ctx: Context) {
        const user = (ctx.request as any).user;
        console.log('Controller - Kullanıcı Bilgisi:', user); // Log: Kullanıcı bilgisi

        if (!user || !user.username) {
            ctx.set.status = 401;
            return { error: "Unauthorized: User information is missing." };
        }

        const body = await ctx.request.json();
        const model = ctx.params.model;

        const prisma = new CreatedByService();
        const result = await prisma.createWithAudit(model, body, user.username);

        return { success: true, data: result };
    },

    async update(ctx: Context) {
        const prisma = new CreatedByService();

        // Token'dan kullanıcı bilgisi al
        const authHeader = ctx.request.headers.get('Authorization');
        if (!authHeader) {
            ctx.set.status = 401;
            return { error: 'Unauthorized: Authorization header is missing.' };
        }

        const token = authHeader.split(' ')[1];
        let username: string;

        try {
            const decoded = jwt.verify(token, SECRET_KEY) as any;
            username = decoded.username;
            console.log("Controller - Doğrulanan kullanıcı:", username);
        } catch (error) {
            ctx.set.status = 401;
            return { error: 'Unauthorized: Invalid or expired token.' };
        }

        // Body ve güncelleme bilgisi al
        const body = await ctx.request.json();
        const model = ctx.params.model;
        const id = ctx.params.id;
        console.log("Controller - Gelen model:", model);
        console.log("Controller - Güncellenecek ID:", id);
        console.log("Controller - Gönderilen veri:", body);

        // Prisma işlemi
        const result = await prisma.updateWithAudit(model, { id }, body, username);

        return { success: true, data: result };
    },
};
