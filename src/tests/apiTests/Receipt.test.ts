import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import receipt from 'c:/Users/amine/Desktop/backend/src/fixtures/receipt.json';

let server: any;
let createdReceiptId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

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
    it('should return receipts for GET /receipts', async () => {
        const response = await fetch('http://localhost:3000/receipts/');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.length).toBeGreaterThanOrEqual(0);
    });

    it('should create a new receipt with POST /receipts', async () => {
        const newReceipt = receipt[0];
        const response = await fetch('http://localhost:3000/receipts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newReceipt),
        });

        const data = await response.json();
        createdReceiptId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
        expect(response.status).toBe(200);
        expect(data.documentNo).toBe(newReceipt.documentNo); 
    });

    it('should update a receipt with PUT /receipts/:id', async () => {
        const updatedReceipt = { documentNo: 'Nakil' };

        // createdId'nin undefined olmadığından emin olun
        expect(createdReceiptId).toBeDefined();

        const response = await fetch(`http://localhost:3000/receipts/${createdReceiptId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedReceipt),
        });

        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.documentNo).toBe(updatedReceipt.documentNo); // Yeni grubun doğru güncellendiğini kontrol ediyoruz
    });

    it('should delete a receipt with DELETE /receipts/:id', async () => {
        const response = await fetch(`http://localhost:3000/receipts/${createdReceiptId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        createdReceiptId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
       
        expect(response.status).toBe(200);
    });
});
