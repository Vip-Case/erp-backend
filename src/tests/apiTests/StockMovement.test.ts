import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import stockMovement from 'c:/Users/amine/Desktop/backend/src/fixtures/stockMovement.json';

let server: any;
let createdStockMovementId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

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
    it('should return stockMovements for GET /stockMovements', async () => {
        const response = await fetch('http://localhost:3000/stockMovements/');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.length).toBeGreaterThanOrEqual(0);
    });

    it('should create a new stockMovement with POST /stockMovements', async () => {
        const newWarehouse = stockMovement[0];
        const response = await fetch('http://localhost:3000/stockMovements/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newWarehouse),
        });

        const data = await response.json();
        createdStockMovementId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
        expect(response.status).toBe(200);
        expect(data.movementType).toBe(newWarehouse.movementType); 
    });

    it('should update a stockMovement with PUT /stockMovements/:id', async () => {
        const updatedWarehouse = { movementType: 'stockMovement1' };

        // createdId'nin undefined olmadığından emin olun
        expect(createdStockMovementId).toBeDefined();

        const response = await fetch(`http://localhost:3000/stockMovements/${createdStockMovementId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedWarehouse),
        });

        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.movementType).toBe(updatedWarehouse.movementType); // Yeni grubun doğru güncellendiğini kontrol ediyoruz
    });

    it('should delete a stockMovement with DELETE /stockMovements/:id', async () => {
        const response = await fetch(`http://localhost:3000/stockMovements/${createdStockMovementId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        createdStockMovementId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
       
        expect(response.status).toBe(200);
    });
});
