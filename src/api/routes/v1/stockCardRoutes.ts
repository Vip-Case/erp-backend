import { Elysia } from 'elysia';
import StockCardController from '../../controllers/stockCardController';

export const StockCardRoutes = (app: Elysia) => {
    app.get('/api/stockcards', StockCardController.getAllStockCards);
    app.post('/api/stockcards', StockCardController.createStockCard);
    app.get('/api/stockcards/:id', StockCardController.getStockCardById);
    app.put('/api/stockcards/:id', StockCardController.updateStockCard);
    app.delete('/api/stockcards/:id', StockCardController.deleteStockCard);
    app.post('/api/createStockCardWithRelations', StockCardController.createStockCardWithRelations);
};

export default StockCardRoutes;