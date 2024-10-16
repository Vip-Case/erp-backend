import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import app from '../..';
import invoce from 'c:/Users/amine/Desktop/backend/src/fixtures/invoice.json';

let server: any;
let createdInvoiceId: string; // Testlerde kullanmak üzere dinamik ID tutacağız

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
    it('should return invoices for GET /companies', async () => {
        const response = await fetch('http://localhost:3000/invoices/');
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.length).toBeGreaterThanOrEqual(0);
    });

    it('should create a new invoice with POST /invoices', async () => {
        const newInvoice = invoce[0];
        const response = await fetch('http://localhost:3000/invoices/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newInvoice),
        });

        const data = await response.json();
        createdInvoiceId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
        expect(response.status).toBe(200);
        expect(data.invoiceNo).toBe(newInvoice.invoiceNo); 
    });

    it('should update a invoice with PUT /invoices/:id', async () => {
        const updatedInvoice = { invoiceNo: 'two' };

        // createdId'nin undefined olmadığından emin olun
        expect(createdInvoiceId).toBeDefined();

        const response = await fetch(`http://localhost:3000/invoices/${createdInvoiceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedInvoice),
        });

        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.invoiceNo).toBe(updatedInvoice.invoiceNo); // Yeni grubun doğru güncellendiğini kontrol ediyoruz
    });

    it('should delete a invoice with DELETE /invoices/:id', async () => {
        const response = await fetch(`http://localhost:3000/invoices/${createdInvoiceId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        createdInvoiceId = data.id;  // Grubun oluşturulduktan sonra sunucudan dönen ID'sini alıyoruz
       
        expect(response.status).toBe(200);
    });
});
