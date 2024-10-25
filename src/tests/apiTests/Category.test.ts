import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import category from 'c:/Users/amine/Desktop/backend/src/fixtures/category.json';

let server: any;
let createdCategoryId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

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
    it('should return categories for GET /categories', async () => {
        const response = await fetch('http://localhost:3000/categories/');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.length).toBeGreaterThanOrEqual(0);
    });

    it('should create a new category with POST /categories', async () => {
        const newCategory = category[0];
        const response = await fetch('http://localhost:3000/categories/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCategory),
        });

        const data = await response.json();
        createdCategoryId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
        expect(response.status).toBe(200);
        expect(data.categoryName).toBe(newCategory.categoryName); 
    });

    it('should update a category with PUT /categories/:id', async () => {
        const updatedCategory = { categoryName: 'One item' };

        // createdId'nin undefined olmadığından emin olun
        expect(createdCategoryId).toBeDefined();

        const response = await fetch(`http://localhost:3000/categories/${createdCategoryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCategory),
        });

        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.categoryName).toBe(updatedCategory.categoryName); // Yeni grubun doğru güncellendiğini kontrol ediyoruz
    });

    it('should delete a category with DELETE /categories/:id', async () => {
        const response = await fetch(`http://localhost:3000/categories/${createdCategoryId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        createdCategoryId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
       
        expect(response.status).toBe(200);
    });
});
