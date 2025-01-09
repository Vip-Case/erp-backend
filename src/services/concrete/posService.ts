
import prisma from "../../config/prisma";
import { Prisma, Pos } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";
import { Decimal } from "@prisma/client/runtime/library";
import { extractUsernameFromToken } from "./extractUsernameService";


export class PosService {
    private posRepository: BaseRepository<Pos>;

    constructor() {
        this.posRepository = new BaseRepository<Pos>(prisma.pos);
    }

    async createPos(pos: Pos, bearerToken: string): Promise<Pos> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            const createdPos = await prisma.pos.create({
                data: {
                    posName: pos.posName,
                    balance: pos.balance,
                    currency: pos.currency,
                    createdByUser: {
                        connect: {
                            username: username
                        }
                    },
                    updatedByUser: {
                        connect: {
                            username: username
                        }
                    },

                    branch: pos.branchCode ? {
                        connect: { branchCode: pos.branchCode },
                    } : {},

                } as Prisma.PosCreateInput,
            });
            return createdPos;
        } catch (error) {
            logger.error("Error creating pos", error);
            throw error;
        }
    }

    async updatePos(id: string, pos: Partial<Pos>, bearerToken: string): Promise<Pos> {
        try {
            const username = extractUsernameFromToken(bearerToken);
            return await prisma.pos.update({
                where: { id },
                data: {
                    posName: pos.posName,
                    balance: pos.balance,
                    currency: pos.currency,
                    updatedByUser: {
                        connect: {
                            username: username
                        }
                    },

                    branch: pos.branchCode ? {
                        connect: { branchCode: pos.branchCode },
                    } : {},

                } as Prisma.PosUpdateInput,
            });
        } catch (error) {
            logger.error(`Error updating pos with id ${id}`, error);
            throw error;
        }
    }

    static async updatePosBalance(id: string, entering: Decimal, emerging: Decimal): Promise<Pos> {
        try {
            const posService = new PosService();
            const pos = await posService.getPosById(id);
            if (!pos) {
                throw new Error(`Pos with id ${id} not found`);
            }

            const updatedBalance = pos.balance.add(entering).sub(emerging);
            return await prisma.pos.update({
                where: { id },
                data: {
                    balance: updatedBalance,
                } as Prisma.PosUpdateInput,
            });
        } catch (error) {
            logger.error(`Error updating pos balance with id ${id}`, error);
            throw error;
        }
    }

    async deletePos(id: string): Promise<any> {
        try {
            const result = await this.posRepository.delete(id);
            const result2 = await prisma.posMovement.deleteMany({
                where: {
                    posId: id,
                },
            });

            return result && result2;
        } catch (error) {
            logger.error(`Error deleting pos with id ${id}`, error);
            throw error;
        }
    }

    async getPosById(id: string): Promise<Pos | null> {
        try {
            return await this.posRepository.findById(id);
        } catch (error) {
            logger.error(`Error fetching pos with id ${id}`, error);
            throw error;
        }
    }

    async getAllPoss(): Promise<Pos[]> {
        try {
            return await this.posRepository.findAll();
        } catch (error) {
            logger.error("Error fetching all poss", error);
            throw error;
        }
    }

}

export default PosService;