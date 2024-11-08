// src/middleware/errorHandler.ts

import { Context } from 'elysia';
import { CustomError } from '../utils/CustomError';
import logger from '../utils/logger';
import { Prisma } from '@prisma/client';

export const errorHandler = async (error: any, context: Context) => {
    // Varsayılan hata yanıtı
    let statusCode = 500;
    let message = 'Beklenmeyen bir hata oluştu.';
    let errorCode: string | undefined;
    let meta: any;

    // Bilinen hata türlerini işleyin
    if (error instanceof CustomError) {
        statusCode = error.statusCode;
        message = error.message;
        errorCode = error.errorCode;
        meta = error.meta;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        statusCode = 400; // Bad Request
        message = 'Veritabanı hatası oluştu.';
        errorCode = error.code;
        meta = error.meta;
    } else if (error instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = 'Doğrulama hatası oluştu.';
        meta = error.message;
    } else if (error instanceof Error) {
        message = error.message;
    }

    // Hataları loglayın
    logger.error('Hata oluştu:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        meta: error.meta,
    });

    // Hata yanıtını gönderin
    (context.response as any).status = statusCode;
    (context.response as any).body = {
        error: {
            message,
            errorCode,
            meta,
        },
    };
};
