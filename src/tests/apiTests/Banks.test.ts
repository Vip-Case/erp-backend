import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import banks from 'c:/Users/amine/Desktop/backend/src/fixtures/banks.json';

let server: any;
let createdBanksId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

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
    it('should return banks for GET /banks', async () => {
        const response = await fetch('http://localhost:3000/banks/');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.length).toBeGreaterThanOrEqual(0);
    });

    it('should create a new bank with POST /banks', async () => {
        const newBanks = banks[0];
        const response = await fetch('http://localhost:3000/banks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBanks),
        });

        const data = await response.json();
        createdBanksId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
        expect(response.status).toBe(200);
        expect(data.bankName).toBe(newBanks.bankName); 
    });

    it('should update a bank with PUT /banks/:id', async () => {
        const updatedBanks = { iban: '1335667' };

        // createdId'nin undefined olmadığından emin olun
        expect(createdBanksId).toBeDefined();

        const response = await fetch(`http://localhost:3000/banks/${createdBanksId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBanks),
        });

        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.iban).toBe(updatedBanks.iban); // Yeni grubun doğru güncellendiğini kontrol ediyoruz
    });

    it('should delete a bank with DELETE /banks/:id', async () => {
        const response = await fetch(`http://localhost:3000/banks/${createdBanksId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        createdBanksId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
       
        expect(response.status).toBe(200);
    });
});
