import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import currentData from '../../fixtures/current.json';

let server: any;
let createdId: string;

// Sunucu başlatma ve kapatma işlemleri
beforeAll(async () => {
    if (!server) {
        server = app.listen(3000);
        console.log('Server is running on http://localhost:3000');
    }
});

afterAll(async () => {
    if (server && server.close) {
        await server.close();
    }
});

describe('API Endpoints for Current', () => {
    // POST: Yeni bir Current kaydı oluşturma
    it('should create a new current with POST /currents', async () => {
        const newCurrent = currentData[0];

        const response = await fetch('http://localhost:3000/currents/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCurrent),
        });
        
        const data = await response.json();
        createdId = data.id; // Yeni oluşturulan kaydın ID'si

        expect(response.status).toBe(200);
        expect(data.currentCode).toBe(newCurrent.current.currentCode);
    });

    // GET: Tüm Current kayıtlarını listeleme
    it('should fetch all currents with GET /currents', async () => {
        const response = await fetch('http://localhost:3000/currents/');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
    });

    // GET: Belirli bir Current kaydını ID ile getirme
    it('should fetch a specific current by ID with GET /currents/:id', async () => {
        const response = await fetch(`http://localhost:3000/currents/${createdId}`);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.id).toBe(createdId);
        expect(data.currentCode).toBe(currentData[0].current.currentCode);
    });

    // PUT: Belirli bir Current kaydını güncelleme
    it('should update a specific current with PUT /currents/:id', async () => {
        const updatedCurrent = {
            ...currentData[0],
            current: { ...currentData[0].current, currentCode: 'UPDATED_CODE' },
        };

        const response = await fetch(`http://localhost:3000/currents/${createdId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCurrent),
        });
        
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.currentCode).toBe('UPDATED_CODE');
    });

    // DELETE: Belirli bir Current kaydını silme
    it('should delete a specific current with DELETE /currents/:id', async () => {
        const response = await fetch(`http://localhost:3000/currents/${createdId}`, {
            method: 'DELETE',
        });
        
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true); // Dönen nesnede `success` alanını kontrol ediyoruz
    });
});