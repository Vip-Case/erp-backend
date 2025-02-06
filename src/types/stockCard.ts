export interface BulkPriceUpdateInput {
    priceListId: string;
    stockCardIds: string[];
    updateType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'NEW_PRICE';
    value: number;
    roundingDecimal?: number;
    updateVatRate?: boolean;
    newVatRate?: number;
}

export interface BulkPriceUpdateResult {
    success: boolean;
    updatedCount: number;
    failedCount: number;
    errors: Array<{ stockCardId: string; error: string }>;
} 