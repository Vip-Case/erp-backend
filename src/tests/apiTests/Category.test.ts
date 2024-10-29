import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import category from '../../fixtures/category.json';

let server: any;
let createdCategoryId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

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

    it('should create a new category with POST /categories', async () => {
        const categories = category;

        for (let index = 0; index < categories.length; index++) {
            const newCategory = categories[index];
            
            const response = await fetch('http://localhost:1303/categories/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCategory),
            });

            const data = await response.json();
            createdCategoryId = data.id;
            expect(response.status).toBe(200);
            expect(data.categoryName).toBe(newCategory.categoryName);
        }
    });

});
