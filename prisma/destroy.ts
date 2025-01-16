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
    await prisma.currentMovement.deleteMany({});
    await prisma.receiptDetail.deleteMany({});
    await prisma.receipt.deleteMany({});
    await prisma.orderPrepareWarehouse.deleteMany({});
    await prisma.stockTake.deleteMany({});
    await prisma.stockTakeDetail.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.productMatch.deleteMany({});
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