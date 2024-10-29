import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import branch from '../../fixtures/branch.json';

let server: any;
let createdBranchId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

// Testlerden önce sunucuyu başlat
beforeAll(async () => {
    if (!server) {
        server = app.listen(3000);
        console.log('Server is running on http://localhost:1303');
    }
});

// Testlerden sonra sunucuyu kapat
afterAll(async () => {
    if (server && server.close) {
        await server.close();
    }
});

describe('API Endpoints', () => {

    it('should create a new branch with POST /branches', async () => {
        const branchs = branch;

        for (let index = 0; index < branchs.length; index++) {
            const newBranch = branchs[index];
            
            const response = await fetch('http://localhost:1303/branches/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBranch),
            });

            const data = await response.json();
            createdBranchId = data.id;
            expect(response.status).toBe(200);
            expect(data.branchCode).toBe(newBranch.branchCode);
        } 
    });
});
