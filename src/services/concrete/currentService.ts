import prisma from "../../config/prisma";
import {
    $Enums,
    Current,
    CurrentAddress,
    CurrentBranch,
    CurrentCategoryItem,
    CurrentFinancial,
    CurrentOfficials,
    CurrentRisk,
    Prisma,
    StockCardPriceList
} from "@prisma/client";
import logger from "../../utils/logger";
import { asyncHandler } from "../../utils/asyncHandler";

const currentRelations = {
    priceList: true,
    currentAddress: true,
    currentBranch: true,
    currentCategoryItem: true,
    currentFinancial: true,
    currentRisk: true,
    currentOfficials: true
};

interface SearchCriteria {
    query?: string; // Genel bir arama için
    currentCode?: string;
    currentName?: string;
}

interface CurrentCreateInput {
    id?: string
    currentCode: string
    currentName: string
    currentType?: $Enums.CurrentType
    institution?: $Enums.InstitutionType
    identityNo?: string | null
    taxNumber?: string | null
    taxOffice?: string | null
    title?: string | null
    name?: string | null
    surname?: string | null
    webSite?: string | null
    birthOfDate?: Date | string | null
    kepAddress?: string | null
    mersisNo?: string | null
    sicilNo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: string | null
    updatedBy?: string | null
    priceListId: string
}

export class currentService {
    async createCurrent(data: {
        current: CurrentCreateInput;
        currentAddress?: Prisma.CurrentAddressCreateNestedManyWithoutCurrentInput;
        currentBranch?: Prisma.CurrentBranchCreateNestedManyWithoutCurrentInput;
        currentCategoryItem?: Prisma.CurrentCategoryItemCreateNestedManyWithoutCurrentInput;
        currentFinancial?: Prisma.CurrentFinancialCreateNestedManyWithoutCurrentInput;
        currentRisk?: Prisma.CurrentRiskCreateNestedManyWithoutCurrentInput;
        currentOfficials?: Prisma.CurrentOfficialsCreateNestedManyWithoutCurrentInput;

    }): Promise<Current> {
        try {

            const newCurrent = await prisma.current.create({
                data: {
                    ...{ ...data.current, priceListId: undefined },
                    priceList: {
                        connect: { id: data.current.priceListId }
                    },
                    currentAddress: data.currentAddress,
                    currentBranch: data.currentBranch,
                    currentCategoryItem: data.currentCategoryItem,
                    currentFinancial: data.currentFinancial,
                    currentRisk: data.currentRisk,
                    currentOfficials: data.currentOfficials

                },
                include: currentRelations
            });

            return newCurrent;
        } catch (error) {
            logger.error("Error creating current:", error);

            // Hata türünü kontrol edin ve uygun şekilde fırlatın
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // Prisma hatası
                throw new Error(`Prisma hatası: ${error.message}`);
            } else if (error instanceof Error) {
                // Genel hata
                throw new Error(`Hata: ${error.message}`);
            } else {
                // Bilinmeyen hata
                throw new Error("Bilinmeyen bir hata oluştu");
            }
        }
    }

    async updateCurrent(id: string, data: {
        current: Prisma.CurrentUpdateInput;
        priceListName: string;
        currentAddress?: Prisma.CurrentAddressUpdateManyWithoutCurrentNestedInput;
        currentBranch?: Prisma.CurrentBranchUpdateManyWithoutCurrentNestedInput;
        currentCategoryItem?: Prisma.CurrentCategoryItemUpdateManyWithoutCurrentNestedInput;
        currentFinancial?: Prisma.CurrentFinancialUpdateManyWithoutCurrentNestedInput;
        currentRisk?: Prisma.CurrentRiskUpdateManyWithoutCurrentNestedInput;
        currentOfficials?: Prisma.CurrentOfficialsUpdateManyWithoutCurrentNestedInput;

    }): Promise<Current> {
        try {
            let priceListConnect = {};

            if (data.priceListName) {
                const priceList = await prisma.stockCardPriceList.findUnique({
                    where: { priceListName: data.priceListName }
                });

                if (!priceList) {
                    throw new Error(`PriceList '${data.priceListName}' bulunamadı.`);
                }

                priceListConnect = { connect: { id: priceList.id } };
            }
            const updatedCurrent = await prisma.current.update({

                where: { id },
                data: {
                    ...data.current,
                    priceList: priceListConnect,
                    currentAddress: data.currentAddress,
                    currentBranch: data.currentBranch,
                    currentCategoryItem: data.currentCategoryItem,
                    currentFinancial: data.currentFinancial,
                    currentRisk: data.currentRisk,
                    currentOfficials: data.currentOfficials

                },
                include: currentRelations
            });

            return updatedCurrent;
        } catch (error) {
            logger.error("Error updating current:", error);
            throw new Error("Could not update current");
        }
    }

    async deleteCurrent(id: string): Promise<{ success: boolean; message: string }> {
        try {
            await prisma.$transaction(async (prisma) => {
                await prisma.current.delete({ where: { id } });
                await prisma.currentAddress.deleteMany({ where: { currentCode: id } });
                await prisma.currentBranch.deleteMany({ where: { currentCode: id } });
                await prisma.currentCategoryItem.deleteMany({ where: { currentCode: id } });
                await prisma.currentFinancial.deleteMany({ where: { currentCode: id } });
                await prisma.currentRisk.deleteMany({ where: { currentCode: id } });
                await prisma.currentOfficials.deleteMany({ where: { currentCode: id } });

            });

            return { success: true, message: "Current successfully deleted" };
        } catch (error) {
            logger.error("Error deleting StockCard:", error);
            return { success: false, message: "Could not delete StockCard" };
        }
    }

    async getCurrentById(id: string): Promise<Current | null> {
        try {
            return await prisma.current.findUnique({
                where: { id },
                include: currentRelations
            });
        } catch (error) {
            logger.error("Error finding StockCard by ID:", error);
            throw new Error("Could not find StockCard by ID");
        }
    }

    async getAllCurrents(): Promise<Current[]> {
        try {
            return await prisma.current.findMany({
                include: currentRelations
            });
        } catch (error) {
            logger.error("Error finding StockCard by ID:", error);
            throw new Error("Could not find StockCard by ID");
        }
    }

    async getCurrentsWithFilters(filters: Partial<Prisma.CurrentWhereInput>): Promise<Current[] | null> {
        try {
            return await prisma.current.findMany({
                where: filters,
                include: currentRelations
            });
        } catch (error) {
            logger.error("Error finding StockCards with filters:", error);
            throw new Error("Could not find StockCards with filters");
        }
    }

    async createCurrentWithRelations(data: {
        current: Current;
        priceList: StockCardPriceList[];
        currentAdress?: CurrentAddress[];
        currentBranch?: CurrentBranch[];
        currentCategoryItem?: CurrentCategoryItem[];
        currentRisk?: CurrentRisk[];
        currentFinancial?: CurrentFinancial[];
        currentOfficials?: CurrentOfficials[];

    }) {
        try {
            const result = await prisma.$transaction(async (prisma) => {

                const current = await prisma.current.create({
                    data: {
                        ...data.current,

                        priceList: data.current.priceListId ? {
                            connect: { id: data.current.priceListId }
                        } : {}

                    } as Prisma.CurrentCreateInput
                });

                const currentCode = current.currentCode;

                if (data.currentAdress) {
                    await Promise.all(
                        data.currentAdress.map((currentAdress) =>
                            prisma.currentAddress.create({
                                data: {
                                    addressName: currentAdress.addressName,
                                    addressType: currentAdress.addressType,
                                    address: currentAdress.address,
                                    countryCode: currentAdress.countryCode,
                                    city: currentAdress.city,
                                    district: currentAdress.district,
                                    postalCode: currentAdress.postalCode,
                                    phone: currentAdress.phone,
                                    phone2: currentAdress.phone2,
                                    email: currentAdress.email,
                                    email2: currentAdress.email2,
                                    current: { connect: { currentCode: currentAdress.currentCode } }
                                }
                            })
                        )
                    );
                }

                if (data.currentBranch) {
                    await Promise.all(
                        data.currentBranch.map((currentBranch) =>
                            prisma.currentBranch.create({
                                data: {
                                    branch: { connect: { branchCode: currentBranch.branchCode } },
                                    current: { connect: { currentCode: currentBranch.currentCode } }
                                }
                            })
                        )
                    );
                }

                if (data.currentFinancial) {
                    await Promise.all(
                        data.currentFinancial.map((currentFinancial) =>
                            prisma.currentFinancial.create({
                                data: {
                                    bankName: currentFinancial.bankName,
                                    bankBranch: currentFinancial.bankBranch,
                                    bankBranchCode: currentFinancial.bankBranchCode,
                                    iban: currentFinancial.iban,
                                    accountNo: currentFinancial.accountNo,
                                    current: { connect: { currentCode: currentFinancial.currentCode } }
                                }
                            })
                        )
                    );
                }

                if (data.currentRisk) {
                    await Promise.all(
                        data.currentRisk.map((currentRisk) =>
                            prisma.currentRisk.create({
                                data: {
                                    currency: currentRisk.currency,
                                    teminatYerelTutar: currentRisk.teminatYerelTutar,
                                    acikHesapYerelLimit: currentRisk.acikHesapYerelLimit,
                                    hesapKesimGunu: currentRisk.hesapKesimGunu,
                                    vadeGun: currentRisk.vadeGun,
                                    gecikmeLimitGunu: currentRisk.gecikmeLimitGunu,
                                    varsayilanAlisIskontosu: currentRisk.varsayilanAlisIskontosu,
                                    varsayilanSatisIskontosu: currentRisk.varsayilanSatisIskontosu,
                                    ekstreGonder: currentRisk.ekstreGonder,
                                    limitKontrol: currentRisk.limitKontrol,
                                    acikHesap: currentRisk.acikHesap,
                                    posKullanim: currentRisk.posKullanim,
                                    current: { connect: { currentCode: currentRisk.currentCode } }
                                }
                            })
                        )
                    );
                }

                if (data.currentOfficials) {
                    await Promise.all(
                        data.currentOfficials.map((currentOfficials) =>
                            prisma.currentOfficials.create({
                                data: {
                                    title: currentOfficials.title,
                                    name: currentOfficials.name,
                                    surname: currentOfficials.surname,
                                    phone: currentOfficials.phone,
                                    email: currentOfficials.email,
                                    note: currentOfficials.note,
                                    current: { connect: { currentCode: currentOfficials.currentCode } }
                                }
                            })
                        )
                    );
                }

                if (data.currentCategoryItem) {
                    await Promise.all(
                        data.currentCategoryItem.map((currentCategoryItem) =>
                            prisma.currentCategoryItem.create({
                                data: {
                                    category: { connect: { id: currentCategoryItem.categoryId } },
                                    current: { connect: { currentCode: currentCategoryItem.currentCode } }
                                }
                            })
                        )
                    );
                }

            });
        } catch (error) {
            logger.error("Error creating StockCard with relations:", error);
            throw new Error("Could not create StockCard with relations");
        }
    }

    async updateCurrentWithRelations(id: string, data: {
        current: Current;
        priceList?: StockCardPriceList[];
        currentAdress?: CurrentAddress[];
        currentBranch?: CurrentBranch[];
        currentCategoryItem?: CurrentCategoryItem[];
        currentRisk?: CurrentRisk[];
        currentFinancial?: CurrentFinancial[];
        currentOfficials?: CurrentOfficials[];
    }) {
        try {
            const result = await prisma.$transaction(async (prisma) => {
                const current = await prisma.current.update({
                    where: { id },
                    data: {
                        ...data.current,

                        priceList: data.current.priceListId ? {
                            connect: { id: data.current.priceListId }
                        } : {}
                    } as Prisma.CurrentUpdateInput
                });

                if (data.currentAdress) {
                    await Promise.all(
                        data.currentAdress.map((currentAdress) =>
                            prisma.currentAddress.update({
                                where: { id: currentAdress.id },
                                data: currentAdress
                            })
                        )
                    );
                }

                if (data.currentBranch) {
                    await Promise.all(
                        data.currentBranch.map((currentBranch) =>
                            prisma.currentBranch.update({
                                where: { id: currentBranch.id },
                                data: currentBranch
                            })
                        )
                    );
                }

                if (data.currentFinancial) {
                    await Promise.all(
                        data.currentFinancial.map((currentFinancial) =>
                            prisma.currentFinancial.update({
                                where: { id: currentFinancial.id },
                                data: currentFinancial
                            })
                        )
                    );
                }

                if (data.currentRisk) {
                    await Promise.all(
                        data.currentRisk.map((currentRisk) =>
                            prisma.currentRisk.update({
                                where: { id: currentRisk.id },
                                data: currentRisk
                            })
                        )
                    );
                }

                if (data.currentOfficials) {
                    await Promise.all(
                        data.currentOfficials.map((currentOfficials) =>
                            prisma.currentOfficials.update({
                                where: { id: currentOfficials.id },
                                data: currentOfficials
                            })
                        )
                    );
                }

                if (data.currentCategoryItem) {
                    await Promise.all(
                        data.currentCategoryItem.map((currentCategoryItem) =>
                            prisma.currentCategoryItem.update({
                                where: { id: currentCategoryItem.id },
                                data: currentCategoryItem
                            })
                        )
                    );
                }

            });
        } catch (error) {
            logger.error("Error creating StockCard with relations:", error);
            throw new Error("Could not create StockCard with relations");
        }
    }

    async deleteCurrentWithRelations(id: string) {
        try {
            return await prisma.$transaction(async (prisma) => {

                await prisma.currentAddress.deleteMany({
                    where: { current: { id } }
                });

                await prisma.currentBranch.deleteMany({
                    where: { current: { id } }
                });

                await prisma.currentCategoryItem.deleteMany({
                    where: { current: { id } }
                });

                await prisma.currentFinancial.deleteMany({
                    where: { current: { id } }
                });

                await prisma.currentOfficials.deleteMany({
                    where: { current: { id } }
                });

                await prisma.currentRisk.deleteMany({
                    where: { current: { id } }
                });

                await prisma.current.deleteMany({
                    where: { id }
                });

            });
        } catch (error) {
            logger.error("Error deleting Current with relations:", error);
            throw new Error("Could not delete Current with relations");
        }
    }

    async getCurrentWithRelationsById(id: string): Promise<Current | null> {
        try {
            return await prisma.current.findUnique({
                where: { id },
                include: currentRelations
            });
        } catch (error) {
            logger.error("Error finding StockCard with relations by ID:", error);
            throw new Error("Could not find StockCard with relations by ID");
        }
    }

    async getAllCurrentWithRelations(): Promise<Current[]> {
        try {
            return await prisma.current.findMany({
                include: currentRelations
            });
        } catch (error) {
            logger.error("Error finding all Current with relations:", error);
            throw new Error("Could not find all Current with relations");
        }
    }

    searchCurrents = asyncHandler(async (criteria: SearchCriteria) => {
        const where: Prisma.CurrentWhereInput = {
            OR: [],
        };

        if (!where.OR) {
            where.OR = [];
        }

        // Eğer belirli kriterler sağlanmışsa, bunları ekle
        if (criteria.currentCode) {
            where.OR.push({
                currentCode: { contains: criteria.currentCode, mode: 'insensitive' },
            });
        }

        if (criteria.currentName) {
            where.OR.push({
                currentName: { contains: criteria.currentName, mode: 'insensitive' },
            });
        }

        // Eğer hiçbir kriter belirtilmemişse, genel query'yi tüm alanlarda ara
        if (where.OR.length === 0 && criteria.query) {
            where.OR.push(
                { currentCode: { contains: criteria.query, mode: 'insensitive' } },
                { currentName: { contains: criteria.query, mode: 'insensitive' } },
            );
        }

        // Eğer hem spesifik kriterler hem genel bir query yoksa, hata döndür
        if (where.OR.length === 0) {
            throw new Error('En az bir arama kriteri veya genel bir sorgu belirtmelisiniz.');
        }

        const currents = await prisma.current.findMany({
            where,
            include: {
                priceList: true,
                currentAddress: true,
                currentBranch: true,
                currentCategoryItem: true,
                currentFinancial: true,
                currentRisk: true,
                currentOfficials: true
            },
        });

        return currents;
    });
}

export default currentService;