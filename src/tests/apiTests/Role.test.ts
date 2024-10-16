import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import role from 'c:/Users/amine/Desktop/backend/src/fixtures/role.json';

let server: any;
let createdRoleId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

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
    it('should return roles for GET /roles', async () => {
        const response = await fetch('http://localhost:3000/roles/');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.length).toBeGreaterThanOrEqual(0);
    });

    it('should create a new role with POST /roles', async () => {
        const newRole = role[0];
        const response = await fetch('http://localhost:3000/roles/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRole),
        });

        const data = await response.json();
        createdRoleId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
        expect(response.status).toBe(200);
        expect(data.roleName).toBe(newRole.roleName); 
    });

    it('should update a role with PUT /roles/:id', async () => {
        const updatedRole = { roleName: 'second' };

        // createdId'nin undefined olmadığından emin olun
        expect(createdRoleId).toBeDefined();

        const response = await fetch(`http://localhost:3000/roles/${createdRoleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedRole),
        });

        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.roleName).toBe(updatedRole.roleName); // Yeni grubun doğru güncellendiğini kontrol ediyoruz
    });

    it('should delete a role with DELETE /roles/:id', async () => {
        const response = await fetch(`http://localhost:3000/roles/${createdRoleId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        createdRoleId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
       
        expect(response.status).toBe(200);
    });
});
