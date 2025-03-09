import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../../utils/logger";

dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET ortam değişkeni tanımlanmamış.");
}
const SECRET_KEY = process.env.JWT_SECRET;

/**
 * Bearer token'dan username'i çıkarır
 * @param bearerToken - Bearer token
 * @returns username
 */

export function extractUsernameFromToken(bearerToken: string): string {
    if (!bearerToken) {
        logger.error("Token formatı geçersiz:", { bearerToken });
        throw new Error("Token formatı geçersiz.");
    }

    try {
        const token = bearerToken.split(" ")[1];
        const decoded = jwt.verify(token, SECRET_KEY) as any;

        if (!decoded || !decoded.username) {
            throw new Error("Token içinde username bulunamadı.");
        }

        return decoded.username;
    } catch (error) {
        logger.error("Token decode hatası:", { error, token: bearerToken });
        throw new Error("Geçersiz veya süresi dolmuş token");
    }
}
