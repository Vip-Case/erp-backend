import { Elysia } from 'elysia';
import { exportExcelController } from '../../controllers/exportExcelController';


const exportRoutes = (app: Elysia) => {
    app.get('/export-stockcards', exportExcelController);
    
};

export default exportRoutes;