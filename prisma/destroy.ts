import prisma from '../src/config/prisma';

async function main() {
    // Delete dependent records first to avoid foreign key constraints
    await prisma.marketPlaceProductImages.deleteMany({});
    await prisma.marketPlaceProductMatch.deleteMany({});
    await prisma.marketPlaceProducts.deleteMany({});
    await prisma.marketPlaceBrands.deleteMany({});
    await prisma.marketPlaceCategories.deleteMany({});
    await prisma.marketPlaceAttributes.deleteMany({});
    await prisma.store.deleteMany({});
    await prisma.marketPlace.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.orderInvoiceAddress.deleteMany({});
    await prisma.orderCargo.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.posMovement.deleteMany({});
    await prisma.pos.deleteMany({});
    await prisma.bankMovement.deleteMany({});
    await prisma.bank.deleteMany({});
    await prisma.vaultMovement.deleteMany({});
    await prisma.vault.deleteMany({});
    await prisma.invoiceDetail.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.receiptDetail.deleteMany({});
    await prisma.receipt.deleteMany({});
    await prisma.stockMovement.deleteMany({});
    await prisma.stockCardManufacturer.deleteMany({});
    await prisma.stockCardAttributeItems.deleteMany({});
    await prisma.stockCardVariation.deleteMany({});
    await prisma.stockCardBarcode.deleteMany({});
    await prisma.stockCardTaxRate.deleteMany({});
    await prisma.stockCardCategoryItem.deleteMany({});
    await prisma.stockCardPriceListItems.deleteMany({});
    await prisma.stockCardMarketNames.deleteMany({});
    await prisma.stockCardEFatura.deleteMany({});
    await prisma.stockCardWarehouse.deleteMany({});
    await prisma.stockCard.deleteMany({});
    await prisma.currentBranch.deleteMany({});
    await prisma.currentAddress.deleteMany({});
    await prisma.currentFinancial.deleteMany({});
    await prisma.currentRisk.deleteMany({});
    await prisma.currentOfficials.deleteMany({});
    await prisma.currentMovement.deleteMany({});
    await prisma.currentCategoryItem.deleteMany({});
    await prisma.current.deleteMany({});
    await prisma.stockCardPriceList.deleteMany({});
    await prisma.stockCardCategory.deleteMany({});
    await prisma.stockCardAttribute.deleteMany({});
    await prisma.brand.deleteMany({});
    await prisma.warehouse.deleteMany({});
    await prisma.branchWarehouse.deleteMany({});
    await prisma.branch.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.permission.deleteMany({});
    await prisma.permissionGroup.deleteMany({});
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