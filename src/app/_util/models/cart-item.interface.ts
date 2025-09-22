import {Cotation} from "@/_util/models/cotation";

export interface CartItem {
  pdf: string;
  productName: string;
  price: number;
  marque: string;
  marquelib: string;
  designation: string;
  prixPublic: number;
  prixD3E: number;
  quantity: number;
  stock: number;
  cotation: Cotation[] | null; // Optional property for Cotation
  cotIndex: number;
}

export interface ShoppingCart {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}
