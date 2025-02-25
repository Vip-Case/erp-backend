import { Elysia } from "elysia";
import { createdByController } from "../../controllers/createdByController";

export const DynamicRoutes = (app: Elysia) => {
  return app.group("/:model", (group) => {
    group.post(
      "/",
      async (ctx) => {
        console.log("Dynamic POST çalışıyor..."); // Log: Route çalışıyor
        return createdByController.create(ctx);
      },
      { tags: ["Dynamic"] }
    );
    group.put(
      "/:id",
      async (ctx) => {
        console.log("Dynamic PUT çalışıyor..."); // Log: Route çalışıyor
        return createdByController.update(ctx);
      },
      { tags: ["Dynamic"] }
    );

    return group; // Burada grup nesnesini döndürdüğünüzden emin olun
  });
};

export default DynamicRoutes;
