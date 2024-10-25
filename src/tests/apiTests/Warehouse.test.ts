import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import warehouse from 'c:/Users/amine/Desktop/backend/src/fixtures/warehouse.json';

let server: any;
let createdWarehosueId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

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
    it('should return warehouses for GET /warehouses', async () => {
        const response = await fetch('http://localhost:3000/warehouses/');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.length).toBeGreaterThanOrEqual(0);
    });

    it('should create a new warehouse with POST /warehouses', async () => {
        const newWarehouse = warehouse[0];
        const response = await fetch('http://localhost:3000/warehouses/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newWarehouse),
        });

        const data = await response.json();
        createdWarehosueId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
        expect(response.status).toBe(200);
        expect(data.warehouseName).toBe(newWarehouse.warehouseName); 
    });

    it('should update a warehouse with PUT /warehouses/:id', async () => {
        const updatedWarehouse = { warehouseName: 'warehouse1' };

        // createdId'nin undefined olmadığından emin olun
        expect(createdWarehosueId).toBeDefined();

        const response = await fetch(`http://localhost:3000/warehouses/${createdWarehosueId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedWarehouse),
        });

        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.warehouseName).toBe(updatedWarehouse.warehouseName); // Yeni grubun doğru güncellendiğini kontrol ediyoruz
    });

    it('should delete a warehouse with DELETE /warehouses/:id', async () => {
        const response = await fetch(`http://localhost:3000/warehouses/${createdWarehosueId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        createdWarehosueId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
       
        expect(response.status).toBe(200);
    });
});
