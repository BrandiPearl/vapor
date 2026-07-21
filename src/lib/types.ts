export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  imageTone: string;
  description: string;
  puffs?: number;
  onSale?: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  inStock?: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
