export interface Cart {
  id: string;
  version: number;
  lineItems: LineItem[];
  totalLineItemQuantity?: number;
}

export interface LineItem {
  id: string;
  productId: string;
  quantity: number;
}
