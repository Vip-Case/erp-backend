import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import stockCard from '../../fixtures/stockCard.json';

let server: any;
let createdStockCardId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

// Testlerden önce sunucuyu başlat
beforeAll(async () => {
    if (!server) {
        server = app.listen(3000);
        console.log('Server is running on http://localhost:3000');
    }
});

// Testlerden sonra sunucuyu kapat
afterAll(async () => {
    if (server && server.close) {
        await server.close();
    }
});

describe('API Endpoints', () => {
    it('should return stockcards for GET /stockcards', async () => {
        const response = await fetch('http://localhost:3000/stockcards/');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.length).toBeGreaterThanOrEqual(0);
    });

    it('should create a new stockcard with POST /stockcards', async () => {
        const newStockCard = stockCard[0];
        const response = await fetch('http://localhost:3000/stockcards/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newStockCard),
        });

        const data = await response.json();
        console.log(response)
        createdStockCardId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
        console.log(response)
        expect(response.status).toBe(200);
        expect(data.productCode).toBe(newStockCard.stockCard.productCode); 
    });

    it('should update a stockcard with PUT /stockcards/:id', async () => {
        const updatedStockCard = { productCode: 'second' };

        // createdId'nin undefined olmadığından emin olun
        expect(createdStockCardId).toBeDefined();

        const response = await fetch(`http://localhost:3000/stockcards/${createdStockCardId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedStockCard),
        });

        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.productCode).toBe(updatedStockCard.productCode); // Yeni grubun doğru güncellendiğini kontrol ediyoruz
    });

    it('should delete a stockcard with DELETE /stockcards/:id', async () => {
        const response = await fetch(`http://localhost:3000/stockcards/${createdStockCardId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        createdStockCardId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
       
        expect(response.status).toBe(200);
    });
});
