
import { Elysia } from 'elysia';
import CompanyController from '../../controllers/companyController';

export const CompanyRoutes = (app: Elysia) => {
    app.group("/companies", (app) =>
        app.get("/", CompanyController.getAllCompanies, { tags: ["Companies"] })
            .post("/", CompanyController.createCompany, { tags: ["Companies"] })
            .get("/:id", CompanyController.getCompanyById, { tags: ["Companies"] })
            .put("/:id", CompanyController.updateCompany, { tags: ["Companies"] })
            .delete("/:id", CompanyController.deleteCompany, { tags: ["Companies"] })
            .get("/filter", CompanyController.getCompaniesWithFilters, { tags: ["Companies"] })
    );
  return app;
};

export default CompanyRoutes;