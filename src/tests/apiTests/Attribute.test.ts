import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import attribute from 'c:/Users/amine/Desktop/backend/src/fixtures/attribute.json';

let server: any;
let createdAttributeId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

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
    it('should return attributes for GET /attributes', async () => {
        const response = await fetch('http://localhost:3000/attributes/');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.length).toBeGreaterThanOrEqual(0);
    });

    it('should create a new attribute with POST /attributes', async () => {
        const newAttribute = attribute[0];
        const response = await fetch('http://localhost:3000/attributes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAttribute),
        });

        const data = await response.json();
        createdAttributeId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
        expect(response.status).toBe(200);
        expect(data.attributeName).toBe(newAttribute.attributeName); 
    });

    it('should update a attribute with PUT /attributes/:id', async () => {
        const updatedAttribute = { attributeName: 'One item' };

        // createdId'nin undefined olmadığından emin olun
        expect(createdAttributeId).toBeDefined();

        const response = await fetch(`http://localhost:3000/attributes/${createdAttributeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedAttribute),
        });

        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.attributeName).toBe(updatedAttribute.attributeName); // Yeni grubun doğru güncellendiğini kontrol ediyoruz
    });

    it('should delete a attribute with DELETE /attributes/:id', async () => {
        const response = await fetch(`http://localhost:3000/attributes/${createdAttributeId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        createdAttributeId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
       
        expect(response.status).toBe(200);
    });
});
