export type CUID = string;

export enum ProductType {
    Simple = 'simple',
    Variant = 'variant',
    Service = 'service',
    Digital = 'digital',
}

export type Currency = 'TRY' | 'USD' | 'EUR';

export type Barcode = string;

export enum TaxRates {
    KDV = 'KDV',
    OTV = 'OTV',
}