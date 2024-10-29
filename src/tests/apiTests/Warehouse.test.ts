import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import warehouse from '../../fixtures/warehouse.json';

let server: any;
let createdWarehosueId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

// Testlerden önce sunucuyu başlat
beforeAll(async () => {
    if (!server) {
        server = app.listen(3000);
        console.log('Server is running on http://localhost:1303');
    }
});

// Testlerden sonra sunucuyu kapat
afterAll(async () => {
    if (server && server.close) {
        await server.close();
    }
});

describe('API Endpoints', () => {

    it('should create a new warehouse with POST /warehouses', async () => {
        const warehouses = warehouse;

        for (let index = 0; index < warehouses.length; index++) {
            const newWarehouse = warehouses[index];
            
            const response = await fetch('http://localhost:1303/warehouses/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newWarehouse),
            });

            const data = await response.json();
            createdWarehosueId = data.id;
            expect(response.status).toBe(200);
            expect(data.warehouseName).toBe(newWarehouse.warehouseName);
        }
    });
});
