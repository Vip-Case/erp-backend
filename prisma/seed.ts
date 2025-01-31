import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
    // Company ekleme
    await prisma.company.create({
        data: {
            companyName: "Company 1",
            companyCode: "C1",
            address: "Company 1 Address",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            phone: "1234567890",
            email: "company@mail.com",
            website: "www.company.com",
        },
    });

    // Branch ekleme
    await prisma.branch.create({
        data: {
            branchName: "Branch 1",
            branchCode: "B1",
            address: "Branch 1 Address",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            phone: "1234567890",
            email: "branch@mail.com",
            website: "www.branch.com",
            company: {
                connect: { companyCode: "C1" },
            },
        },
    });

    // Warehouse ekleme
    await prisma.warehouse.create({
        data: {
            warehouseName: "Warehouse 1",
            warehouseCode: "W1",
            address: "Warehouse 1 Address",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            phone: "1234567890",
            email: "warehouse@mail.com",
            company: {
                connect: { companyCode: "C1" },
            },
        },
    });

    // Branch Warehouse ekleme
    await prisma.branchWarehouse.create({
        data: {
            branch: {
                connect: { branchCode: "B1" },
            },
            warehouse: {
                connect: { warehouseCode: "W1" },
            },
        },
    });

    // Price List ekleme
    const priceList1 = await prisma.stockCardPriceList.create({
        data: {
            priceListName: "Tip 1 Bayiler",
            currency: "USD",
            isVatIncluded: true,
            isActive: true,
        },
    });

    // Price List ekleme
    const priceList2 = await prisma.stockCardPriceList.create({
        data: {
            priceListName: "Tip 2 Bayiler",
            currency: "USD",
            isVatIncluded: true,
            isActive: true,
        },
    });

    // Price List ekleme
    const priceList3 = await prisma.stockCardPriceList.create({
        data: {
            priceListName: "Tip 3 Bayiler",
            currency: "USD",
            isVatIncluded: true,
            isActive: true,
        },
    });

    // Price List ekleme
    const priceList4 = await prisma.stockCardPriceList.create({
        data: {
            priceListName: "Perakende",
            currency: "TRY",
            isVatIncluded: false,
            isActive: true,
        },
    });

    // Price List ekleme
    const priceList5 = await prisma.stockCardPriceList.create({
        data: {
            priceListName: "E-Ticaret",
            currency: "TRY",
            isVatIncluded: true,
            isActive: true,
        },
    });

    const priceList6 = await prisma.stockCardPriceList.create({
        data: {
            priceListName: "Woocommerce",
            currency: "USD",
            isVatIncluded: true,
            isActive: true,
        },
    });


    // Current1 ekleme
    await prisma.current.create({
        data: {
            currentName: "Current 1",
            currentCode: "C1",
            currentType: "AliciSatici",
            institution: "Sirket",
            identityNo: "1234567890",
            taxNumber: "1234567890",
            taxOffice: "Kadikoy",
            title: "Unvan",
            name: "Name",
            surname: "Surname",
            webSite: "www.current1.com",
            birthOfDate: new Date(),
            kepAddress: "Kep Address",
            mersisNo: "1234567890",
            sicilNo: "1234567890",

            priceList: {
                connect: { priceListName: "Tip 1 Bayiler" },
            },
        },
    });

    // Current2 ekleme
    await prisma.current.create({
        data: {
            currentName: "Current 2",
            currentCode: "C2",
            currentType: "Tedarikci",
            institution: "Sirket",
            identityNo: "1234567890",
            taxNumber: "1234567890",
            taxOffice: "Kadikoy",
            title: "Unvan",
            name: "Name",
            surname: "Surname",
            webSite: "www.current2.com",
            birthOfDate: new Date(),
            kepAddress: "Kep Address",
            mersisNo: "1234567890",
            sicilNo: "1234567890",

            priceList: {
                connect: { priceListName: "Tip 1 Bayiler" },
            },
        },
    });

    // Current3 ekleme
    await prisma.current.create({
        data: {
            currentName: "Current 3",
            currentCode: "C3",
            currentType: "Alici",
            institution: "Sirket",
            identityNo: "1234567890",
            taxNumber: "1234567890",
            taxOffice: "Kadikoy",
            title: "Unvan",
            name: "Name",
            surname: "Surname",
            webSite: "www.current3.com",
            birthOfDate: new Date(),
            kepAddress: "Kep Address",
            mersisNo: "1234567890",
            sicilNo: "1234567890",

            priceList: {
                connect: { priceListName: "Tip 1 Bayiler" },
            },
        },
    });

    // Current4 ekleme
    await prisma.current.create({
        data: {
            currentName: "Current 4",
            currentCode: "C4",
            currentType: "Satici",
            institution: "Sahis",
            identityNo: "1234567890",
            taxNumber: "1234567890",
            taxOffice: "Kadikoy",
            title: "Unvan",
            name: "Name",
            surname: "Surname",
            webSite: "www.current4.com",
            birthOfDate: new Date(),
            kepAddress: "Kep Address",
            mersisNo: "1234567890",
            sicilNo: "1234567890",

            priceList: {
                connect: { priceListName: "Tip 2 Bayiler" },
            },
        },
    });

    // Current5 ekleme
    await prisma.current.create({
        data: {
            currentName: "Current 5",
            currentCode: "C5",
            currentType: "Personel",
            institution: "Sahis",
            identityNo: "1234567890",
            taxNumber: "1234567890",
            taxOffice: "Kadikoy",
            title: "Unvan",
            name: "Name",
            surname: "Surname",
            webSite: "www.current5.com",
            birthOfDate: new Date(),
            kepAddress: "Kep Address",
            mersisNo: "1234567890",
            sicilNo: "1234567890",

            priceList: {
                connect: { priceListName: "Tip 2 Bayiler" },
            },
        },
    });

    // Current6 ekleme
    await prisma.current.create({
        data: {
            currentName: "Current 6",
            currentCode: "C6",
            currentType: "SanalPazar",
            institution: "Sirket",
            identityNo: "1234567890",
            taxNumber: "1234567890",
            taxOffice: "Kadikoy",
            title: "Unvan",
            name: "Name",
            surname: "Surname",
            webSite: "www.current6.com",
            birthOfDate: new Date(),
            kepAddress: "Kep Address",
            mersisNo: "1234567890",
            sicilNo: "1234567890",

            priceList: {
                connect: { priceListName: "Tip 2 Bayiler" },
            },
        },
    });

    // Current7 ekleme
    await prisma.current.create({
        data: {
            currentName: "Current 7",
            currentCode: "C7",
            currentType: "Kurum",
            institution: "Sirket",
            identityNo: "1234567890",
            taxNumber: "1234567890",
            taxOffice: "Kadikoy",
            title: "Unvan",
            name: "Name",
            surname: "Surname",
            webSite: "www.current7.com",
            birthOfDate: new Date(),
            kepAddress: "Kep Address",
            mersisNo: "1234567890",
            sicilNo: "1234567890",

            priceList: {
                connect: { priceListName: "Tip 3 Bayiler" },
            },
        },
    });

    // Current8 ekleme
    await prisma.current.create({
        data: {
            currentName: "Current 8",
            currentCode: "C8",
            currentType: "AnaGrupSirketi",
            institution: "Sirket",
            identityNo: "1234567890",
            taxNumber: "1234567890",
            taxOffice: "Kadikoy",
            title: "Unvan",
            name: "Name",
            surname: "Surname",
            webSite: "www.current8.com",
            birthOfDate: new Date(),
            kepAddress: "Kep Address",
            mersisNo: "1234567890",
            sicilNo: "1234567890",

            priceList: {
                connect: { priceListName: "Tip 3 Bayiler" },
            },
        },
    });

    // Current9 ekleme
    await prisma.current.create({
        data: {
            currentName: "Current 9",
            currentCode: "C9",
            currentType: "Ithalat",
            institution: "Sirket",
            identityNo: "1234567890",
            taxNumber: "1234567890",
            taxOffice: "Kadikoy",
            title: "Unvan",
            name: "Name",
            surname: "Surname",
            webSite: "www.current9.com",
            birthOfDate: new Date(),
            kepAddress: "Kep Address",
            mersisNo: "1234567890",
            sicilNo: "1234567890",

            priceList: {
                connect: { priceListName: "Tip 3 Bayiler" },
            },
        },
    });

    // Current10 ekleme
    await prisma.current.create({
        data: {
            currentName: "Current 10",
            currentCode: "C10",
            currentType: "Ihracat",
            institution: "Sirket",
            identityNo: "1234567890",
            taxNumber: "1234567890",
            taxOffice: "Kadikoy",
            title: "Unvan",
            name: "Name",
            surname: "Surname",
            webSite: "www.current10.com",
            birthOfDate: new Date(),
            kepAddress: "Kep Address",
            mersisNo: "1234567890",
            sicilNo: "1234567890",

            priceList: {
                connect: { priceListName: "Perakende" },
            },
        },
    });

    // Current11 ekleme
    await prisma.current.create({
        data: {
            currentName: "Current 11",
            currentCode: "C11",
            currentType: "IthalatIhracat",
            institution: "Sirket",
            identityNo: "1234567890",
            taxNumber: "1234567890",
            taxOffice: "Kadikoy",
            title: "Unvan",
            name: "Name",
            surname: "Surname",
            webSite: "www.current11.com",
            birthOfDate: new Date(),
            kepAddress: "Kep Address",
            mersisNo: "1234567890",
            sicilNo: "1234567890",

            priceList: {
                connect: { priceListName: "Perakende" },
            },
        },
    });

    // Current12 ekleme
    await prisma.current.create({
        data: {
            currentName: "Current 12",
            currentCode: "C12",
            currentType: "Musteri",
            institution: "Sahis",
            identityNo: "1234567890",
            taxNumber: "1234567890",
            taxOffice: "Kadikoy",
            title: "Unvan",
            name: "Name",
            surname: "Surname",
            webSite: "www.current12.com",
            birthOfDate: new Date(),
            kepAddress: "Kep Address",
            mersisNo: "1234567890",
            sicilNo: "1234567890",

            priceList: {
                connect: { priceListName: "Perakende" },
            },
        },
    });

    // Current13 ekleme
    await prisma.current.create({
        data: {
            currentName: "Current 13",
            currentCode: "C13",
            currentType: "Diger",
            institution: "Sahis",
            identityNo: "1234567890",
            taxNumber: "1234567890",
            taxOffice: "Kadikoy",
            title: "Unvan",
            name: "Name",
            surname: "Surname",
            webSite: "www.current13.com",
            birthOfDate: new Date(),
            kepAddress: "Kep Address",
            mersisNo: "1234567890",
            sicilNo: "1234567890",

            priceList: {
                connect: { priceListName: "Tip 1 Bayiler" },
            },
        },
    });

    // Current Category ekleme
    await prisma.currentCategory.create({
        data: {
            categoryName: "Category 1",
            categoryCode: "Cat1",
        },
    });

    // Current Category ekleme
    await prisma.currentCategory.create({
        data: {
            categoryName: "Category 2",
            categoryCode: "C2",
            parentCategory: {
                connect: { categoryCode: "Cat1" },
            },
        },
    });

    // Current Category ekleme
    await prisma.currentCategory.create({
        data: {
            categoryName: "Category 3",
            categoryCode: "C3",
            parentCategory: {
                connect: { categoryCode: "C2" },
            },
        },
    });

    // Get Current Category Id

    const currentCategory1 = await prisma.currentCategory.findUnique({
        where: { categoryCode: "Cat1" },
        select: { id: true },
    });

    const currentCategory2 = await prisma.currentCategory.findUnique({
        where: { categoryCode: "C2" },
        select: { id: true },
    });

    const currentCategory3 = await prisma.currentCategory.findUnique({
        where: { categoryCode: "C3" },
        select: { id: true },
    });

    // Current Category Item ekleme
    if (currentCategory1?.id) {
        await prisma.currentCategoryItem.create({
            data: {
                current: {
                    connect: { currentCode: "C1" },
                },
                category: {
                    connect: { id: currentCategory1.id },
                },
            },
        });
    } else {
        console.error("Current category ID not found");
    }

    // Current Category Item ekleme
    if (currentCategory1?.id) {
        await prisma.currentCategoryItem.create({
            data: {
                current: {
                    connect: { currentCode: "C2" },
                },
                category: {
                    connect: { id: currentCategory1.id },
                },
            },
        });
    } else {
        console.error("Current category ID not found");
    }

    // Current Category Item ekleme
    if (currentCategory1?.id) {
        await prisma.currentCategoryItem.create({
            data: {
                current: {
                    connect: { currentCode: "C3" },
                },
                category: {
                    connect: { id: currentCategory1.id },
                },
            },
        });
    } else {
        console.error("Current category ID not found");
    }

    // Current Category Item ekleme
    if (currentCategory1?.id) {
        await prisma.currentCategoryItem.create({
            data: {
                current: {
                    connect: { currentCode: "C4" },
                },
                category: {
                    connect: { id: currentCategory1.id },
                },
            },
        });
    } else {
        console.error("Current category ID not found");
    }

    // Current Category Item ekleme
    if (currentCategory2?.id) {
        await prisma.currentCategoryItem.create({
            data: {
                current: {
                    connect: { currentCode: "C5" },
                },
                category: {
                    connect: { id: currentCategory2.id },
                },
            },
        });
    } else {
        console.error("Current category ID not found");
    }

    // Current Category Item ekleme
    if (currentCategory2?.id) {
        await prisma.currentCategoryItem.create({
            data: {
                current: {
                    connect: { currentCode: "C6" },
                },
                category: {
                    connect: { id: currentCategory2.id },
                },
            },
        });
    } else {
        console.error("Current category ID not found");
    }

    // Current Category Item ekleme
    if (currentCategory2?.id) {
        await prisma.currentCategoryItem.create({
            data: {
                current: {
                    connect: { currentCode: "C7" },
                },
                category: {
                    connect: { id: currentCategory2.id },
                },
            },
        });
    } else {
        console.error("Current category ID not found");
    }

    // Current Category Item ekleme
    if (currentCategory2?.id) {
        await prisma.currentCategoryItem.create({
            data: {
                current: {
                    connect: { currentCode: "C8" },
                },
                category: {
                    connect: { id: currentCategory2.id },
                },
            },
        });
    } else {
        console.error("Current category ID not found");
    }

    // Current Category Item ekleme
    if (currentCategory3?.id) {
        await prisma.currentCategoryItem.create({
            data: {
                current: {
                    connect: { currentCode: "C9" },
                },
                category: {
                    connect: { id: currentCategory3.id },
                },
            },
        });
    } else {
        console.error("Current category ID not found");
    }

    // Current Category Item ekleme
    if (currentCategory3?.id) {
        await prisma.currentCategoryItem.create({
            data: {
                current: {
                    connect: { currentCode: "C10" },
                },
                category: {
                    connect: { id: currentCategory3.id },
                },
            },
        });
    } else {
        console.error("Current category ID not found");
    }

    // Current Category Item ekleme
    if (currentCategory3?.id) {
        await prisma.currentCategoryItem.create({
            data: {
                current: {
                    connect: { currentCode: "C11" },
                },
                category: {
                    connect: { id: currentCategory3.id },
                },
            },
        });
    } else {
        console.error("Current category ID not found");
    }

    // Current Category Item ekleme
    if (currentCategory3?.id) {
        await prisma.currentCategoryItem.create({
            data: {
                current: {
                    connect: { currentCode: "C12" },
                },
                category: {
                    connect: { id: currentCategory3.id },
                },
            },
        });
    } else {
        console.error("Current category ID not found");
    }

    // Current Category Item ekleme
    if (currentCategory3?.id) {
        await prisma.currentCategoryItem.create({
            data: {
                current: {
                    connect: { currentCode: "C13" },
                },
                category: {
                    connect: { id: currentCategory3.id },
                },
            },
        });
    } else {
        console.error("Current category ID not found");
    }

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 1",
            addressType: "Fatura",
            address: "Address 1",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C1" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 2",
            addressType: "Sevk",
            address: "Address 2",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C1" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 3",
            addressType: "Teslimat",
            address: "Address 3",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C1" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 1",
            addressType: "Fatura",
            address: "Address 1",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C2" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 2",
            addressType: "Sevk",
            address: "Address 2",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C2" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 3",
            addressType: "Teslimat",
            address: "Address 3",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C2" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 1",
            addressType: "Fatura",
            address: "Address 1",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C3" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 2",
            addressType: "Sevk",
            address: "Address 2",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C3" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 3",
            addressType: "Teslimat",
            address: "Address 3",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C3" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 1",
            addressType: "Fatura",
            address: "Address 1",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C4" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 2",
            addressType: "Sevk",
            address: "Address 2",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C4" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 3",
            addressType: "Teslimat",
            address: "Address 3",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C4" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 1",
            addressType: "Fatura",
            address: "Address 1",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C5" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 2",
            addressType: "Sevk",
            address: "Address 2",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C5" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 3",
            addressType: "Teslimat",
            address: "Address 3",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C5" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 1",
            addressType: "Fatura",
            address: "Address 1",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C6" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 2",
            addressType: "Sevk",
            address: "Address 2",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C6" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 3",
            addressType: "Teslimat",
            address: "Address 3",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C6" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 1",
            addressType: "Fatura",
            address: "Address 1",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C7" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 2",
            addressType: "Sevk",
            address: "Address 2",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C7" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 3",
            addressType: "Teslimat",
            address: "Address 3",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C7" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 1",
            addressType: "Fatura",
            address: "Address 1",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C8" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 2",
            addressType: "Sevk",
            address: "Address 2",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C8" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 3",
            addressType: "Teslimat",
            address: "Address 3",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C8" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 1",
            addressType: "Fatura",
            address: "Address 1",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C9" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 2",
            addressType: "Sevk",
            address: "Address 2",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C9" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 3",
            addressType: "Teslimat",
            address: "Address 3",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C9" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 1",
            addressType: "Fatura",
            address: "Address 1",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C10" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 2",
            addressType: "Sevk",
            address: "Address 2",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C10" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 3",
            addressType: "Teslimat",
            address: "Address 3",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C10" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 1",
            addressType: "Fatura",
            address: "Address 1",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C11" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 2",
            addressType: "Sevk",
            address: "Address 2",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C11" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 3",
            addressType: "Teslimat",
            address: "Address 3",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C11" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 1",
            addressType: "Fatura",
            address: "Address 1",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C12" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 2",
            addressType: "Sevk",
            address: "Address 2",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C12" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 3",
            addressType: "Teslimat",
            address: "Address 3",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C12" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 1",
            addressType: "Fatura",
            address: "Address 1",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C13" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 2",
            addressType: "Sevk",
            address: "Address 2",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C13" },
            },
        },
    });

    // Current Address ekleme
    await prisma.currentAddress.create({
        data: {
            addressName: "Address 3",
            addressType: "Teslimat",
            address: "Address 3",
            countryCode: "TR",
            city: "Istanbul",
            district: "Kadikoy",
            postalCode: "123456",
            phone: "1234567890",
            phone2: "1234567890",
            email: "email1@mail.com",
            email2: "email2@mail.com",
            current: {
                connect: { currentCode: "C13" },
            },
        },
    });

    // Current Financial ekleme
    await prisma.currentFinancial.create({
        data: {
            bankName: "Bank 1",
            bankBranch: "Branch 1",
            bankBranchCode: "123456",
            iban: "TR1234567890",
            accountNo: "1234567890",
            current: {
                connect: { currentCode: "C1" },
            },
        },
    });

    // Current Financial ekleme
    await prisma.currentFinancial.create({
        data: {
            bankName: "Bank 2",
            bankBranch: "Branch 2",
            bankBranchCode: "123456",
            iban: "TR1234567890",
            accountNo: "1234567890",
            current: {
                connect: { currentCode: "C2" },
            },
        },
    });

    // Current Financial ekleme
    await prisma.currentFinancial.create({
        data: {
            bankName: "Bank 3",
            bankBranch: "Branch 3",
            bankBranchCode: "123456",
            iban: "TR1234567890",
            accountNo: "1234567890",
            current: {
                connect: { currentCode: "C3" },
            },
        },
    });

    // Current Financial ekleme
    await prisma.currentFinancial.create({
        data: {
            bankName: "Bank 4",
            bankBranch: "Branch 4",
            bankBranchCode: "123456",
            iban: "TR1234567890",
            accountNo: "1234567890",
            current: {
                connect: { currentCode: "C4" },
            },
        },
    });

    // Current Financial ekleme
    await prisma.currentFinancial.create({
        data: {
            bankName: "Bank 5",
            bankBranch: "Branch 5",
            bankBranchCode: "123456",
            iban: "TR1234567890",
            accountNo: "1234567890",
            current: {
                connect: { currentCode: "C5" },
            },
        },
    });

    // Current Financial ekleme
    await prisma.currentFinancial.create({
        data: {
            bankName: "Bank 6",
            bankBranch: "Branch 6",
            bankBranchCode: "123456",
            iban: "TR1234567890",
            accountNo: "1234567890",
            current: {
                connect: { currentCode: "C6" },
            },
        },
    });

    // Current Financial ekleme
    await prisma.currentFinancial.create({
        data: {
            bankName: "Bank 7",
            bankBranch: "Branch 7",
            bankBranchCode: "123456",
            iban: "TR1234567890",
            accountNo: "1234567890",
            current: {
                connect: { currentCode: "C7" },
            },
        },
    });

    // Current Financial ekleme
    await prisma.currentFinancial.create({
        data: {
            bankName: "Bank 8",
            bankBranch: "Branch 8",
            bankBranchCode: "123456",
            iban: "TR1234567890",
            accountNo: "1234567890",
            current: {
                connect: { currentCode: "C8" },
            },
        },
    });

    // Current Financial ekleme
    await prisma.currentFinancial.create({
        data: {
            bankName: "Bank 9",
            bankBranch: "Branch 9",
            bankBranchCode: "123456",
            iban: "TR1234567890",
            accountNo: "1234567890",
            current: {
                connect: { currentCode: "C9" },
            },
        },
    });

    // Current Financial ekleme
    await prisma.currentFinancial.create({
        data: {
            bankName: "Bank 10",
            bankBranch: "Branch 10",
            bankBranchCode: "123456",
            iban: "TR1234567890",
            accountNo: "1234567890",
            current: {
                connect: { currentCode: "C10" },
            },
        },
    });



    // Stock Card Category ekleme
    const stockCardCategory1 = await prisma.stockCardCategory.create({
        data: {
            categoryCode: "SCC1",
            categoryName: "Category 1",
        },
    });

    // Stock Card Category ekleme
    const stockCardCategory2 = await prisma.stockCardCategory.create({
        data: {
            categoryCode: "SCC2",
            categoryName: "Category 2",
        },
    });

    // Stock Card Category ekleme
    const stockCardCategory3 = await prisma.stockCardCategory.create({
        data: {
            categoryCode: "SCC3",
            categoryName: "Category 3",
        },
    });

    // Stock Card Category ekleme
    const stockCardCategory4 = await prisma.stockCardCategory.create({
        data: {
            categoryCode: "SCC4",
            categoryName: "Category 4",
            parentCategory: {
                connect: { categoryCode: "SCC1" },
            },
        },
    });

    // Stock Card Category ekleme
    const stockCardCategory5 = await prisma.stockCardCategory.create({
        data: {
            categoryCode: "SCC5",
            categoryName: "Category 5",
            parentCategory: {
                connect: { categoryCode: "SCC2" },
            },
        },
    });

    // Stock Card Category ekleme
    const stockCardCategory6 = await prisma.stockCardCategory.create({
        data: {
            categoryCode: "SCC6",
            categoryName: "Category 6",
            parentCategory: {
                connect: { categoryCode: "SCC3" },
            },
        },
    });

    // Stock Card Category ekleme
    const stockCardCategory7 = await prisma.stockCardCategory.create({
        data: {
            categoryCode: "SCC7",
            categoryName: "Category 7",
            parentCategory: {
                connect: { categoryCode: "SCC4" },
            },
        },
    });

    // Stock Card Attribute ekleme
    const attribute1value1 = await prisma.stockCardAttribute.create({
        data: {
            attributeName: "Attribute 1",
            value: "Value 1",
        },
    });

    // Stock Card Attribute ekleme
    const attribute1value2 = await prisma.stockCardAttribute.create({
        data: {
            attributeName: "Attribute 1",
            value: "Value 2",
        },
    });

    // Stock Card Attribute ekleme
    const attribute1value3 = await prisma.stockCardAttribute.create({
        data: {
            attributeName: "Attribute 1",
            value: "Value 3",
        },
    });

    // Stock Card Attribute ekleme
    const attribute2value1 = await prisma.stockCardAttribute.create({
        data: {
            attributeName: "Attribute 2",
            value: "Value 1",
        },
    });

    // Stock Card Attribute ekleme
    const attribute2value2 = await prisma.stockCardAttribute.create({
        data: {
            attributeName: "Attribute 2",
            value: "Value 2",
        },
    });

    // Stock Card Attribute ekleme
    const attribute2value3 = await prisma.stockCardAttribute.create({
        data: {
            attributeName: "Attribute 2",
            value: "Value 3",
        },
    });

    // Stock Card Attribute ekleme
    const attribute3value1 = await prisma.stockCardAttribute.create({
        data: {
            attributeName: "Attribute 3",
            value: "Value 4",
        },
    });

    // Stock Card Attribute ekleme
    const attribute3value2 = await prisma.stockCardAttribute.create({
        data: {
            attributeName: "Attribute 3",
            value: "Value 5",
        },
    });

    // Stock Card Attribute ekleme
    const attribute4value1 = await prisma.stockCardAttribute.create({
        data: {
            attributeName: "Attribute 4",
            value: "Value 5",
        },
    });

    // Stock Card Attribute ekleme
    const attribute4value2 = await prisma.stockCardAttribute.create({
        data: {
            attributeName: "Attribute 4",
            value: "Value 6",
        },
    });

    // Brand ekleme
    await prisma.brand.create({
        data: {
            brandCode: "B1",
            brandName: "Brand 1",
        },
    });

    // Brand ekleme
    await prisma.brand.create({
        data: {
            brandCode: "B2",
            brandName: "Brand 2",
        },
    });



    // Varsayılan izinler
    const createPermission = await prisma.permission.upsert({
        where: { permissionName: 'create' },
        update: {},
        create: {
            permissionName: 'create',
            description: 'Create data',
        },
    });

    const readPermission = await prisma.permission.upsert({
        where: { permissionName: 'read' },
        update: {},
        create: {
            permissionName: 'read',
            description: 'Read data',
        },
    });

    const updatePermission = await prisma.permission.upsert({
        where: { permissionName: 'update' },
        update: {},
        create: {
            permissionName: 'update',
            description: 'Update data',
        },
    });

    const deletePermission = await prisma.permission.upsert({
        where: { permissionName: 'delete' },
        update: {},
        create: {
            permissionName: 'delete',
            description: 'Delete data',
        },
    });

    // Varsayılan roller
    const adminRole = await prisma.role.upsert({
        where: { roleName: 'admin' },
        update: {},
        create: {
            roleName: 'admin',
            description: 'Admin role with full access',
            permission: {
                connect: [
                    { id: createPermission.id },
                    { id: readPermission.id },
                    { id: updatePermission.id },
                    { id: deletePermission.id },
                ],
            },
        },
    });

    const userRole = await prisma.role.upsert({
        where: { roleName: 'user' },
        update: {},
        create: {
            roleName: 'user',
            description: 'Standard user role with limited access',
            permission: {
                connect: [
                    { id: readPermission.id },
                ],
            },
        },
    });


    const hashedPassword = await bcrypt.hash('admin_password', 10);

    // Admin rolüyle kullanıcı ekleyin
    await prisma.user.create({
        data: {
            username: 'admin_user',
            email: 'admin@example.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            phone: '123456789',
            address: 'Admin Address',
            companyCode: 'C1',
            role: {
                connect: { roleName: 'admin' } // admin rolüyle bağlanıyor
            },
        },
    });


    // Kasa ekleme
    const vault1 = await prisma.vault.create({
        data: {
            vaultName: "Dolar Kasası",
            branch: {
                connect: { branchCode: "B1" },
            },
            balance: 1000,
            currency: "USD",
        },
    });

    const vault1Id = vault1.id;

    // Kasa ekleme
    const vault2 = await prisma.vault.create({
        data: {
            vaultName: "TL Kasası",
            branch: {
                connect: { branchCode: "B1" },
            },
            balance: 36000,
            currency: "TRY",
        },
    });

    const vault2Id = vault2.id;

    const marketPlace = await prisma.marketPlace.create({
        data: {
            name: "Woo",
            apiBaseUrl: "https://api.woo.com",
            logoUrl: "https://example.com/logo-woo.png",
            companyCode: "C1", // Bağlantılı bir şirket kodu varsa eklenmeli
        },
    });

    // Store ekleme
    const store = await prisma.store.create({
        data: {
            name: "Woocommerce",
            marketPlaceId: marketPlace.id, // MarketPlace ile ilişkilendirme
            apiCredentials: JSON.stringify({
                baseUrl: "https://demo.novent.com.tr",
                consumerKey: "ck_6ce522841d1f2ea094045f83d155c1897ebf1385",
                consumerSecret: "cs_c89bbcc0de3bbf122459e104423b80b69dcbe294",
            }),
            autoInvoiceCreation: true,
            storeUrl: "https://demo.novent.com.tr"
        },
    });
}

main()
    .then(() => {
        console.log("Data oluşturuldu");
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });