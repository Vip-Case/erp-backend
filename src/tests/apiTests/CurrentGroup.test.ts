import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import currentGroup from '../../fixtures/currentGroup.json';

let server: any;
let createdGroupId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

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
    it('should return current groups for GET /currentGroups', async () => {
        const response = await fetch('http://localhost:3000/currentGroups/');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.length).toBeGreaterThanOrEqual(0);
    });

    it('should create a new group with POST /currentGroups', async () => {
        const newGroup = currentGroup[0];
        const response = await fetch('http://localhost:3000/currentGroups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newGroup),
        });

        const data = await response.json();
        createdGroupId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
        expect(response.status).toBe(201);
        expect(data.groupCode).toBe(newGroup.groupCode);
        expect(data.description).toBe(newGroup.description);
    });

    it('should update a group with PUT /currentGroups/:id', async () => {
        const updatedGroup = { description: 'updated 7 description' };

        // createdGroupId'nin undefined olmadığından emin olun
        expect(createdGroupId).toBeDefined();

        const response = await fetch(`http://localhost:3000/currentGroups/${createdGroupId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedGroup),
        });

        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.description).toBe(updatedGroup.description); // Yeni grubun doğru güncellendiğini kontrol ediyoruz
    });

    it('should delete a group with DELETE /currentGroups/:id', async () => {
        const response = await fetch(`http://localhost:3000/currentGroups/${createdGroupId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        createdGroupId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
       
        expect(response.status).toBe(200);
    });
});
