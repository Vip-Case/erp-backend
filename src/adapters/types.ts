export interface TrendyolOrderResponse {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  content: TrendyolOrder[];
}

export interface TrendyolOrder {
  orderNumber: string;
  customerId: number | string;
  status: string;
  orderDate: number | string;
  totalPrice: number;
  currencyCode: string;
  cargoProviderName?: string;
  cargoTrackingNumber?: string | number;
  deliveryAddressType: 'Shipment' | 'CollectionPoint';
  invoiceAddress: TrendyolAddress;
  shipmentAddress: TrendyolAddress;
  lines: TrendyolOrderLine[];
}

export interface TrendyolAddress {
  address1: string;
  city: string;
  district: string;
  postalCode: string;
  countryCode: string;
  fullName: string;
  email?: string | null;
}

interface DiscountDetail {
  lineItemPrice: number;
  lineItemDiscount: number;
  lineItemTyDiscount: number;
}

export interface TrendyolOrderLine {
  quantity: number;
  price: number;
  productCode: string | number;
  merchantSku?: string;
  productName: string;
  productSize?: string;
  productColor?: string;
  productOrigin?: string;
  salesCampaignId?: number;
  merchantId?: number;
  amount?: number;
  discount?: number;
  tyDiscount?: number;
  discountDetails?: DiscountDetail[];
  currencyCode?: string;
  id?: number;
  sku?: string;
  vatBaseAmount?: number;
  barcode?: string;
  orderLineItemStatusName?: string;
} 