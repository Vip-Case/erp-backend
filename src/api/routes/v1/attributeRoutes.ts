import { Elysia } from 'elysia';
import AttributeController from '../../controllers/attributeController';

export const AttributeRoutes = (app: Elysia) => {
    app.group("/attributes", (app) =>
        app.get("/", AttributeController.getAllAttributes, { tags: ["Attributes"] })
            .post("/", AttributeController.createAttribute, { tags: ["Attributes"] })
            .post("/createMany", AttributeController.createManyAttributes, { tags: ["Attributes"] })
            .get("/:id", AttributeController.getAttributeById, { tags: ["Attributes"] })
            .put("/:id", AttributeController.updateAttribute, { tags: ["Attributes"] })
            .delete("/:id", AttributeController.deleteAttribute, { tags: ["Attributes"] })
    );
};

export default AttributeRoutes;