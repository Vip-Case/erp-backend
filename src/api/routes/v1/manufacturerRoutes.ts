import { Elysia } from 'elysia';
import ManufacturerController from '../../controllers/manufacturerController';

export const ManufacturerRoutes = (app: Elysia) => {
    app.group("/manufacturers", (app) =>
        app.get("/", ManufacturerController.getAllManufacturers, { tags: ["Manufacturers"] })
            .post("/", ManufacturerController.createManufacturer, { tags: ["Manufacturers"] })
            .get("/:id", ManufacturerController.getManufacturerById, { tags: ["Manufacturers"] })
            .put("/:id", ManufacturerController.updateManufacturer, { tags: ["Manufacturers"] })
            .delete("/:id", ManufacturerController.deleteManufacturer, { tags: ["Manufacturers"] })
    );
};

export default ManufacturerRoutes;