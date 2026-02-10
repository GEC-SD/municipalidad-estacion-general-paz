import { Status } from './global';

export type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type ShopSlice = {
  cart: CartItem[];
  products: Product[];
  status: {
    [key: string]: Status;
  };
};
