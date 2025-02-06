import { Elysia } from "elysia";
import VaultController from "../../controllers/vaultController";

export const VaultRoutes = (app: Elysia) => {
  app.group("/vaults", (app) =>
    app
      .get("/", VaultController.getAllVaults, { tags: ["Vaults"] })
      .post("/", VaultController.createVault, { tags: ["Vaults"] })
      .get("/:id", VaultController.getVaultById, { tags: ["Vaults"] })
      .put("/:id", VaultController.updateVault, { tags: ["Vaults"] })
      .delete("/:id", VaultController.deleteVault, { tags: ["Vaults"] })
  );
  return app;
};

export default VaultRoutes;
