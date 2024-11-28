import prisma from '../src/config/prisma';


async function main() {
    // Delete dependent records of Current
    await prisma.stockCardManufacturer.deleteMany({});
    await prisma.stockCardEFatura.deleteMany({});
    await prisma.stockCardMarketNames.deleteMany({});
    await prisma.stockCardAttributeItems.deleteMany({});
    await prisma.currentBranch.deleteMany({});
    await prisma.currentAddress.deleteMany({});
    await prisma.currentFinancial.deleteMany({});
    await prisma.currentRisk.deleteMany({});
    await prisma.currentOfficials.deleteMany({});
    await prisma.currentMovement.deleteMany({});
    await prisma.currentCategoryItem.deleteMany({});
    // Delete Current records
    await prisma.current.deleteMany({});

    // Delete other dependent records
    await prisma.stockCardWarehouse.deleteMany({});
    await prisma.stockMovement.deleteMany({});
    await prisma.invoiceDetail.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.stockCardTaxRate.deleteMany({});
    await prisma.stockCardPriceListItems.deleteMany({});
    await prisma.stockCardCategoryItem.deleteMany({});
    await prisma.stockCardBarcode.deleteMany({});
    await prisma.stockCard.deleteMany({});
    await prisma.stockCardAttributeItems.deleteMany({});
    await prisma.stockCardAttribute.deleteMany({});

    // Delete StockCardPriceList after dependents are removed
    await prisma.stockCardPriceList.deleteMany({});

    // Continue deleting other data
    await prisma.stockCardCategory.deleteMany({});
    await prisma.warehouse.deleteMany({});
    await prisma.branchWarehouse.deleteMany({});
    await prisma.brand.deleteMany({});
    await prisma.currentCategory.deleteMany({});
    await prisma.vaultMovement.deleteMany({});
    await prisma.vault.deleteMany({});

    await prisma.branch.deleteMany({});
    await prisma.company.deleteMany({});
}

main()
    .then(() => {
        console.log('Data destroyed');
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });