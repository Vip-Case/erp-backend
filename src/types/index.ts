export type UUID = string;

export enum ProductType {
    Simple = 'simple',
    Variant = 'variant',
    Service = 'service',
    Digital = 'digital',
}

export type Currency = 'TRY' | 'USD' | 'EUR';

export type Barcode = string;

export type RiskQuantity = {
    period: '1_month' | '3_months' | '6_months';
    quantity: number;
};

export type Category = {
id: UUID;
name: string;
};

export type Attribute = {
name: string;
value: string;
};