import { Elysia } from 'elysia';
import { importExcelController } from '../../controllers/importExcelController';

const importRoutes = (app: Elysia) => {
    app.post('/import-excel', importExcelController);
};

export default importRoutes;
