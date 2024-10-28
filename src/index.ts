import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { appConfig } from './config/app';
import StockCardRoutes from './api/routes/v1/stockCardRoutes';
import PriceListRoutes from './api/routes/v1/priceListRoutes';
import AttributeRoutes from './api/routes/v1/attributeRoutes';
import StockMovementRoutes from './api/routes/v1/stockMovementRoutes';
import CompanyRoutes from './api/routes/v1/companyRoutes';
import WarehouseRoutes from './api/routes/v1/warehouseRoutes';
import BranchRoutes from './api/routes/v1/branchRoutes';
import CurrentRoutes from './api/routes/v1/currentRoutes';
import CurrentMovementRoutes from './api/routes/v1/currentMovementRoutes';
import CurrentGroupRoutes from './api/routes/v1/currentGroupRoutes';
import UserRoutes from './api/routes/v1/userRoutes';
import RoleRoutes from './api/routes/v1/roleRoutes';
import InvoiceRoutes from './api/routes/v1/invoiceRoutes';
import CategoryRoutes from './api/routes/v1/categoryRoutes';
import ReceiptRoutes from './api/routes/v1/receiptRoutes';

// Uygulama instance'ı oluşturuluyor
const app = new Elysia()
  .use(swagger({
    path: "/docs", // Swagger UI'nin erişim yolu
    provider: 'scalar', // API provider'ı
    documentation: {
      info: {
        title: "ERP API", // API başlığı
        version: "1.0.0", // API versiyonu
        description: "ERP API Documentation", // API açıklaması
      },
      tags: [
        { name: "Stock Cards", description: "Stock Card operations" }, // Stock Card'lar için tag
        { name: "Price Lists", description: "Price List operations" }, // Price List'ler için tag
        { name: "Attributes", description: "Attribute operations" }, // Attribute'lar için tag
        { name: "Stock Movements", description: "Stock Movement operations" }, // Stock Movement'lar için tag
        { name: "Companies", description: "Company operations" }, // Company'ler için tag
        { name: "Branches", description: "Branch operations" }, // Branch'ler için tag
        { name: "Warehouses", description: "Warehouse operations" }, // Warehouse'lar için tag
        { name: "Categories", description: "Category operations" }, // Category'ler için tag
        { name: "Currents", description: "Current operations" }, // Current'lar için tag
        { name: "Current Movements", description: "Current Movement operations" }, // Current Movement'lar için tag
        { name: "Current Groups", description: "Current Group operations" }, // Current Group'lar için tag
        { name: "Users", description: "User operations" }, // User'lar için tag
        { name: "Roles", description: "Role operations" }, // Role'lar için tag
        { name: "Invoices", description: "Invoice operations" }, // Invoice'lar için
        { name: "Receipts", description: "Receipt operations" }, // Receipt'lar için
        { name: "Banks", description: "Banks operations" }, // Banks'lar için

        
      ]
    },
  }))
  .get("/", () => "Elysia is running!") // Ana route tanımlanıyor

// API rotalarını dahil ediyoruz
StockCardRoutes(app);
PriceListRoutes(app);
AttributeRoutes(app);
StockMovementRoutes(app);
CompanyRoutes(app);
BranchRoutes(app);
WarehouseRoutes(app);
CategoryRoutes(app);
CurrentRoutes(app);
CurrentMovementRoutes(app);
CurrentGroupRoutes(app);
UserRoutes(app);
RoleRoutes(app);
InvoiceRoutes(app);
ReceiptRoutes(app);


// Uygulama belirtilen portta dinlemeye başlıyor
app.listen(appConfig.port, () => {
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
});

export default app;