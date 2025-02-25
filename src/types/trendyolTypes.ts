export interface TrendyolOrder {
  orderNumber: string;
  status?: string;
  shipmentPackageStatus?: string;
  customerId: number;
  orderDate: number;
  totalPrice: number;
  deliveryAddressType: string;
  cargoProviderName?: string;
  cargoTrackingNumber?: number | string;
  currencyCode?: string;
  
  invoiceAddress: {
    id?: number;
    firstName?: string;
    lastName?: string;
    address1: string;
    city: string;
    district: string;
    postalCode: string;
    countryCode: string;
    fullName: string;
    fullAddress?: string;
  };
  
  shipmentAddress: {
    id?: number;
    firstName?: string;
    lastName?: string;
    address1: string;
    city: string;
    district: string;
    postalCode: string;
    countryCode: string;
    fullName: string;
    fullAddress?: string;
  };
  
  lines: Array<{
    id?: number;
    quantity: number;
    price: number;
    productName: string;
    productCode: number;
    barcode?: string;
    merchantSku?: string;
    productSize?: string;
    productColor?: string;
    productOrigin?: string;
    salesCampaignId?: number;
    merchantId?: number;
    amount?: number;
    discount?: number;
    tyDiscount?: number;
    vatBaseAmount?: number;
    currencyCode?: string;
    sku?: string;
    orderLineItemStatusName?: string;
  }>;
  
  // Yeni alanlar
  packageHistories?: Array<{
    createdDate: number;
    status: string;
  }>;
  customerFirstName?: string;
  customerLastName?: string;
  customerEmail?: string;
  grossAmount?: number;
  totalDiscount?: number;
  fastDelivery?: boolean;
} 