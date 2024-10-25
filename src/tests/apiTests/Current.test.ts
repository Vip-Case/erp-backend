import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import current from 'c:/Users/amine/Desktop/backend/src/fixtures/current.json';

let server: any;
let createdId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

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
    it('should return currents for GET /currents', async () => {
        const response = await fetch('http://localhost:3000/currents/');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.length).toBeGreaterThanOrEqual(0);
    });

    it('should create a new current with POST /currents', async () => {
        const newCurrent = current[0];
        const response = await fetch('http://localhost:3000/currents/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCurrent),
        });

        const data = await response.json();
        createdId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
        expect(response.status).toBe(200);
        expect(data.currentCode).toBe(newCurrent.currentCode);
    });

    it('should update a current with PUT /currents/:id', async () => {
        const updatedCurrent = { currentName: 'update name' };

        // createdId'nin undefined olmadığından emin olun
        expect(createdId).toBeDefined();

        const response = await fetch(`http://localhost:3000/currents/${createdId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCurrent),
        });

        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.currentName).toBe(updatedCurrent.currentName); // Yeni grubun doğru güncellendiğini kontrol ediyoruz
    });

    it('should delete a current with DELETE /currents/:id', async () => {
        const response = await fetch(`http://localhost:3000/currents/${createdId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        createdId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
       
        expect(response.status).toBe(200);
    });
});
