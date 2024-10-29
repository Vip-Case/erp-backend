import soap from 'soap';

export class SoapClientService {
    private client: any;

    constructor(private wsdlUrl: string) { }

    async initialize() {
        this.client = await soap.createClientAsync(this.wsdlUrl);
    }

    async sendInvoice(invoiceData: any) {
        if (!this.client) await this.initialize();

        try {
            const [result] = await this.client.SendInvoiceAsync(invoiceData);
            return result;
        } catch (error) {
            console.error("SOAP isteği başarısız:", error);
            throw new Error("SOAP isteği başarısız.");
        }
    }
}
