import { Elysia } from 'elysia';
import { exportExcelController } from '../../controllers/exportExcelController';


const exportRoutes = (app: Elysia) => {
    app.get('/export-stockcard-sablon', exportExcelController);
    
  return app;
};

export default exportRoutes;