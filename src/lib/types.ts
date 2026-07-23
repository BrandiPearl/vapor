export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  description: string;
  shortDescription?: string;
  puffs?: number;
  onSale?: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  inStock?: boolean;
  tags?: string[];
  imageUrls?: string[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type DbProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  category_name: string | null;
  description: string | null;
  price: number | string;
  compare_at_price: number | string | null;
  image_url: string | null;
  puffs: number | null;
  on_sale: boolean;
  featured: boolean;
  best_seller: boolean;
  in_stock: boolean;
  metadata: {
    sku?: string | null;
    short_description?: string;
    tags?: string[];
    source_images?: string[];
    image_urls?: string[];
    variations?: unknown[];
  } | null;
};
