import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import currentMovement from 'c:/Users/amine/Desktop/backend/src/fixtures/currentMovement.json';

let server: any;
let createdMovementId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

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
    it('should return currentMovements for GET /currentMovements', async () => {
        const response = await fetch('http://localhost:3000/currentMovements/');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.length).toBeGreaterThanOrEqual(0);
    });

    it('should create a new currentMovement with POST /currentMovements', async () => {
        const newCurrentMovement = currentMovement[0];
        const response = await fetch('http://localhost:3000/currentMovements/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCurrentMovement),
        });

        const data = await response.json();
        createdMovementId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
        expect(response.status).toBe(200);
        expect(data.movementType).toBe(newCurrentMovement.movementType); 
    });

    it('should update a currentMovement with PUT /currentMovements/:id', async () => {
        const updatedCurrentMovement = { movementType: 'Alacak' };

        // createdId'nin undefined olmadığından emin olun
        expect(createdMovementId).toBeDefined();

        const response = await fetch(`http://localhost:3000/currentMovements/${createdMovementId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCurrentMovement),
        });

        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.movementType).toBe(updatedCurrentMovement.movementType); // Yeni grubun doğru güncellendiğini kontrol ediyoruz
    });

    it('should delete a currentMovement with DELETE /currentMovements/:id', async () => {
        const response = await fetch(`http://localhost:3000/currentMovements/${createdMovementId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        createdMovementId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
       
        expect(response.status).toBe(200);
    });
});
