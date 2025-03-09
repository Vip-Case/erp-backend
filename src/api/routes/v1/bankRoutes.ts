import { Elysia } from "elysia";
import BankController from "../../controllers/bankController";

export const BankRoutes = (app: Elysia) => {
  return app.group("/banks", (app) =>
    app
      .get("/", BankController.getAllBanks, { tags: ["Banks"] })
      .post("/", BankController.createBank, { tags: ["Banks"] })
      .get("/:id", BankController.getBankById, { tags: ["Banks"] })
      .put("/:id", BankController.updateBank, { tags: ["Banks"] })
      .delete("/:id", BankController.deleteBank, { tags: ["Banks"] })
  );
};

export default BankRoutes;
