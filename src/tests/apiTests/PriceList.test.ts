import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import priceList from 'c:/Users/amine/Desktop/backend/src/fixtures/priceList.json';

let server: any;
let createdPriceListId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

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
    it('should return priceLists for GET /priceLists', async () => {
        const response = await fetch('http://localhost:3000/priceLists/');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.length).toBeGreaterThanOrEqual(0);
    });

    it('should create a new priceList with POST /priceLists', async () => {
        const newPriceList = priceList[0];
        const response = await fetch('http://localhost:3000/priceLists/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPriceList),
        });

        const data = await response.json();
        createdPriceListId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
        expect(response.status).toBe(200);
        expect(data.priceListName).toBe(newPriceList.priceListName); 
    });

    it('should update a priceList with PUT /priceLists/:id', async () => {
        const updatedPriceList = { priceListName: 'second' };

        // createdId'nin undefined olmadığından emin olun
        expect(createdPriceListId).toBeDefined();

        const response = await fetch(`http://localhost:3000/priceLists/${createdPriceListId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPriceList),
        });

        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.priceListName).toBe(updatedPriceList.priceListName); // Yeni grubun doğru güncellendiğini kontrol ediyoruz
    });

    it('should delete a priceList with DELETE /priceLists/:id', async () => {
        const response = await fetch(`http://localhost:3000/priceLists/${createdPriceListId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        createdPriceListId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
       
        expect(response.status).toBe(200);
    });
});
