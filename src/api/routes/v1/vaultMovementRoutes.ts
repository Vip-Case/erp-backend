import { Elysia } from 'elysia';
import VaultMovementController from '../../controllers/vaultMovementController';

export const VaultMovementRoutes = (app: Elysia) => {
    app.group("/VaultMovements", (app) =>
        app.get("/", VaultMovementController.getAllVaultMovements, { tags: ["VaultMovements"] })
            .post("/", VaultMovementController.createVaultMovement, { tags: ["VaultMovements"] })
            .get("/:id", VaultMovementController.getVaultMovementById, { tags: ["VaultMovements"] })
            .put("/:id", VaultMovementController.updateVaultMovement, { tags: ["VaultMovements"] })
            .delete("/:id", VaultMovementController.deleteVaultMovement, { tags: ["VaultMovements"] })
    );
  return app;
};

export default VaultMovementRoutes;