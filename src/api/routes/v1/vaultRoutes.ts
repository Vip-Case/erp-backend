import { Elysia } from 'elysia';
import VaultController from '../../controllers/vaultController';
import { VaultPlain } from '../../../../prisma/prismabox/Vault';

export const VaultRoutes = (app: Elysia) => {
    app.group("/vaults", (app) =>
        app.get("/", VaultController.getAllVaults, { tags: ["Vaults"], response: { body: VaultPlain } })
            .post("/", VaultController.createVault, { tags: ["Vaults"] })
            .get("/:id", VaultController.getVaultById, { tags: ["Vaults"] })
            .put("/:id", VaultController.updateVault, { tags: ["Vaults"] })
            .delete("/:id", VaultController.deleteVault, { tags: ["Vaults"] })
    );
};

export default VaultRoutes;