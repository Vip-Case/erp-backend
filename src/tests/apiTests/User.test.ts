import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import user from 'c:/Users/amine/Desktop/backend/src/fixtures/user.json';

let server: any;
let createdUserId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

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
    it('should return users for GET /users', async () => {
        const response = await fetch('http://localhost:3000/users/');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.length).toBeGreaterThanOrEqual(0);
    });

    it('should create a new user with POST /users', async () => {
        const newUser = user[0];
        const response = await fetch('http://localhost:3000/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });

        const data = await response.json();
        createdUserId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
        expect(response.status).toBe(200);
        expect(data.username).toBe(newUser.username); 
    });

    it('should update a user with PUT /users/:id', async () => {
        const updatedUser = { username: 'user1' };

        // createdId'nin undefined olmadığından emin olun
        expect(createdUserId).toBeDefined();

        const response = await fetch(`http://localhost:3000/users/${createdUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        });

        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.username).toBe(updatedUser.username); // Yeni grubun doğru güncellendiğini kontrol ediyoruz
    });

    it('should delete a user with DELETE /users/:id', async () => {
        const response = await fetch(`http://localhost:3000/users/${createdUserId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        createdUserId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
       
        expect(response.status).toBe(200);
    });
});
