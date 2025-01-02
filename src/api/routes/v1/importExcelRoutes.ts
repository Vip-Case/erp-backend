import { Elysia } from 'elysia';
import { importExcelController } from '../../controllers/importExcelController';

const importRoutes = (app: Elysia) => {
  app.post('/import-stock', importExcelController);

  return app;
};

export default importRoutes;
