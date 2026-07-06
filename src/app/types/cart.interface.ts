export interface Cart {
  id: string;
  version: number;
  lineItems: LineItem[];
  totalPrice: Price;
  totalLineItemQuantity: number;
  anonymousId?: string;
}

export interface LineItem {
  id: string;
  productId: string;
  quantity: number;
}

export interface Price {
  currencyCode: string;
  centAmount: number;
  fractionDigits: number;
}

export interface CartStorage {
  id: string;
  anonymousId?: string;

}
