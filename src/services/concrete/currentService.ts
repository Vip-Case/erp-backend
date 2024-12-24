import prisma from "../../config/prisma";
import {
    $Enums,
    Current,
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

interface CurrentData {
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

interface CurrentAddress {
    id?: string
    addressName: string
    addressType: $Enums.AddressType
    address: string
    countryCode: string
    province: string
    district: string
    postalCode: string
    phone: string
    phone2: string
    email: string
    email2: string
}

export class currentService {
    async createCurrent(data: {
        current: CurrentData;
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

    async updateCurrent(id: string, data: any): Promise<Current> {
        try {
            // Restructure the incoming data
            const updateData = {
                current: {
                    currentCode: data.currentCode,
                    currentName: data.currentName,
                    currentType: data.currentType,
                    institution: data.institution,
                    identityNo: data.identityNo,
                    taxNumber: data.taxNumber,
                    taxOffice: data.taxOffice,
                    kepAddress: data.kepAddress,
                    mersisNo: data.mersisNo,
                    sicilNo: data.sicilNo,
                    title: data.title,
                    webSite: data.webSite,
                    birthOfDate: data.birthOfDate,
                    priceListId: data.priceListId
                },
                currentAddress: data.addresses ? {
                    // Delete existing addresses
                    deleteMany: {},
                    // Create new ones
                    create: data.addresses.map(address => ({
                        ...address,
                        id: undefined // Remove id to allow new creation
                    }))
                } : undefined,
                currentCategoryItem: data.categories ? {
                    // Delete existing categories
                    deleteMany: {},
                    // Create new ones
                    create: data.categories.map(category => ({
                        category: { connect: { id: category } }
                    }))
                } : undefined,
            };

            const updatedCurrent = await prisma.current.update({
                where: { id },
                data: {
                    ...updateData.current,
                    priceList: {
                        connect: { id: updateData.current.priceListId }
                    },
                    currentAddress: updateData.currentAddress,
                    currentCategoryItem: updateData.currentCategoryItem
                },
                include: currentRelations
            });

            return updatedCurrent;
        } catch (error) {
            logger.error("Error updating current:", error);
            throw new Error(`Could not update current: ${error.message}`);
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
        categories?: string[];
        addresses?: CurrentAddress[];
        currentBranch?: CurrentBranch[];
        currentRisk?: CurrentRisk[];
        currentFinancial?: CurrentFinancial[];
        currentOfficials?: CurrentOfficials[];

    }) {
        try {
            const result = await prisma.$transaction(async (prisma) => {
                console.log(data);

                const current = await prisma.current.create({
                    data: {
                        currentCode: data.currentCode,
                        currentName: data.currentName,
                        currentType: data.currentType,
                        institution: data.institution,
                        identityNo: data.identityNo,
                        taxNumber: data.taxNumber,
                        taxOffice: data.taxOffice,
                        title: data.title,
                        name: data.name,
                        surname: data.surname,
                        webSite: data.webSite,
                        birthOfDate: data.birthOfDate,
                        kepAddress: data.kepAddress,
                        mersisNo: data.mersisNo,
                        sicilNo: data.sicilNo,
                        priceList: {
                            connect: {
                                id: data.priceListId
                            }
                        }
                    }
                });
                const currentCode = current.currentCode;
                if (data.addresses) {
                    await Promise.all(
                        data.addresses.map((currentAdress) =>
                            prisma.currentAddress.create({
                                data: {
                                    addressName: currentAdress.addressName,
                                    addressType: currentAdress.addressType,
                                    address: currentAdress.address,
                                    countryCode: currentAdress.countryCode,
                                    city: currentAdress.province,
                                    district: currentAdress.district,
                                    postalCode: currentAdress.postalCode,
                                    phone: currentAdress.phone,
                                    phone2: currentAdress.phone2,
                                    email: currentAdress.email,
                                    email2: currentAdress.email2,
                                    current: { connect: { currentCode: currentCode } }
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
                                    current: { connect: { currentCode: currentCode } }
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
                                    current: { connect: { currentCode: currentCode } }
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
                                    current: { connect: { currentCode: currentCode } }
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
                                    current: { connect: { currentCode: currentCode } }
                                }
                            })
                        )
                    );
                }

                if (data.categories) {
                    await Promise.all(
                        data.categories.map((currentCategoryItem) =>
                            prisma.currentCategoryItem.create({
                                data: {
                                    category: { connect: { id: currentCategoryItem } },
                                    current: { connect: { currentCode: currentCode } }
                                }
                            })
                        )
                    );
                }

            });
            return result;
        } catch (error) {
            logger.error("Error creating StockCard with relations:", error);
            throw new Error(`Could not create StockCard with relations: ${error}`);
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

    async deleteManyCurrentsWithRelations(data: any) {
        try {
            // Input data contains {ids: [...]} structure, so extract the ids array
            const idsArray = Array.isArray(data.ids) ? data.ids : [data.ids];

            if (idsArray.length === 0) {
                throw new Error("No ids provided");
            }

            // Extract just the id values
            const idList = idsArray.map(item => item.id);

            return await prisma.$transaction(async (prisma) => {
                await prisma.currentAddress.deleteMany({
                    where: { current: { id: { in: idList } } }
                });

                await prisma.currentBranch.deleteMany({
                    where: { current: { id: { in: idList } } }
                });

                await prisma.currentCategoryItem.deleteMany({
                    where: { current: { id: { in: idList } } }
                });

                await prisma.currentFinancial.deleteMany({
                    where: { current: { id: { in: idList } } }
                });

                await prisma.currentOfficials.deleteMany({
                    where: { current: { id: { in: idList } } }
                });

                await prisma.currentRisk.deleteMany({
                    where: { current: { id: { in: idList } } }
                });

                await prisma.current.deleteMany({
                    where: { id: { in: idList } }
                });

            });
        } catch (error) {
            logger.error("Error deleting Current with relations:", error);
            throw new Error(`Could not delete Current with relations${error}`);
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