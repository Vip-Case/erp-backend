
import { Elysia } from 'elysia';
import UserController from '../../controllers/userController';

export const UserRoutes = (app: Elysia) => {
  app.group("/users", (app) =>
    app.get("/", UserController.getAllUsers, { tags: ["Users"] })
      .post("/create", UserController.createUser, { tags: ["Users"] })
      .get("/:id", UserController.getUserById, { tags: ["Users"] })
      .put("/:id", UserController.updateUser, { tags: ["Users"] })
      .delete("/:id", UserController.deleteUser, { tags: ["Users"] })
      .get("/filter", UserController.getUsersWithFilters, { tags: ["Users"] })
  );
  return app;
};

export default UserRoutes;