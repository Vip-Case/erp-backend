import { Elysia } from 'elysia';
import VaultMovementController from '../../controllers/vaultMovementController';
import { VaultMovementPlain } from '../../../../prisma/prismabox/VaultMovement';

export const VaultMovementRoutes = (app: Elysia) => {
    app.group("/VaultMovements", (app) =>
        app.get("/", VaultMovementController.getAllVaultMovements, { tags: ["VaultMovements"], response: { body: VaultMovementPlain } })
            .post("/", VaultMovementController.createVaultMovement, { tags: ["VaultMovements"] })
            .get("/:id", VaultMovementController.getVaultMovementById, { tags: ["VaultMovements"] })
            .put("/:id", VaultMovementController.updateVaultMovement, { tags: ["VaultMovements"] })
            .delete("/:id", VaultMovementController.deleteVaultMovement, { tags: ["VaultMovements"] })
    );
};

export default VaultMovementRoutes;