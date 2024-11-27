import { Elysia } from 'elysia';
import BankMovementController from '../../controllers/bankMovementController';

export const BankMovementRoutes = (app: Elysia) => {
    app.group("/bankMovements", (app) =>
        app.get("/", BankMovementController.getAllBankMovements, { tags: ["BankMovements"] })
            .post("/", BankMovementController.createBankMovement, { tags: ["BankMovements"] })
            .get("/:id", BankMovementController.getBankMovementById, { tags: ["BankMovements"] })
            .get("/bank/:id", BankMovementController.getBankMovementsByBankId, { tags: ["BankMovements"] })
            .put("/:id", BankMovementController.updateBankMovement, { tags: ["BankMovements"] })
            .delete("/:id", BankMovementController.deleteBankMovement, { tags: ["BankMovements"] })
    );
};

export default BankMovementRoutes;