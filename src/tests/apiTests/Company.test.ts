import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import company from 'c:/Users/amine/Desktop/backend/src/fixtures/company.json';

let server: any;
let createdCompanyId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

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
    it('should return currents for GET /companies', async () => {
        const response = await fetch('http://localhost:3000/companies/');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.length).toBeGreaterThanOrEqual(0);
    });

    it('should create a new current with POST /companies', async () => {
        const newCompany = company[0];
        const response = await fetch('http://localhost:3000/companies/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCompany),
        });

        const data = await response.json();
        createdCompanyId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
        expect(response.status).toBe(200);
        expect(data.companyCode).toBe(newCompany.companyCode); 
    });

    it('should update a current with PUT /companies/:id', async () => {
        const updatedCompany = { companyCode: 'second company' };

        // createdId'nin undefined olmadığından emin olun
        expect(createdCompanyId).toBeDefined();

        const response = await fetch(`http://localhost:3000/companies/${createdCompanyId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCompany),
        });

        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.companyCode).toBe(updatedCompany.companyCode); // Yeni grubun doğru güncellendiğini kontrol ediyoruz
    });

    it('should delete a current with DELETE /companies/:id', async () => {
        const response = await fetch(`http://localhost:3000/companies/${createdCompanyId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        createdCompanyId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
       
        expect(response.status).toBe(200);
    });
});
