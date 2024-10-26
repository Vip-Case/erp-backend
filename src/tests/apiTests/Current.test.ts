import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import current from '../../fixtures/current.json';

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
    it('should create a new current with POST /currents', async () => {
        const currents = current;
        for (let index = 0; index < currents.length; index++) {
            const newCurrent = currents[index];

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
            
        }
        
        
    });
});
