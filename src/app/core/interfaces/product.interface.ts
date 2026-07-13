export interface Product {
  id?: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  category: 'Vestidos' | 'Camisas' | 'Calças' | 'Tênis' | 'Acessórios';
  stock_quantity: number;
  image_url?: string;
  is_new?: boolean;
  is_promo?: boolean;
  sizes?: string[];
}
