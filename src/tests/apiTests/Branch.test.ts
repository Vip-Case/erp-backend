import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import branch from 'c:/Users/amine/Desktop/backend/src/fixtures/branch.json';

let server: any;
let createdBranchId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

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
    it('should return currents for GET /branches', async () => {
        const response = await fetch('http://localhost:3000/branches/');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.length).toBeGreaterThanOrEqual(0);
    });

    it('should create a new current with POST /branches', async () => {
        const newBranch = branch[0];
        const response = await fetch('http://localhost:3000/branches/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBranch),
        });

        const data = await response.json();
        createdBranchId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
        expect(response.status).toBe(200);
        expect(data.branchCode).toBe(newBranch.branchCode); 
    });

    it('should update a current with PUT /branches/:id', async () => {
        const updatedBranch = { branchName: 'One branch' };

        // createdId'nin undefined olmadığından emin olun
        expect(createdBranchId).toBeDefined();

        const response = await fetch(`http://localhost:3000/branches/${createdBranchId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBranch),
        });

        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.branchName).toBe(updatedBranch.branchName); // Yeni grubun doğru güncellendiğini kontrol ediyoruz
    });

    it('should delete a current with DELETE /branches/:id', async () => {
        const response = await fetch(`http://localhost:3000/branches/${createdBranchId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        createdBranchId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
       
        expect(response.status).toBe(200);
    });
});
