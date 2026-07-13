export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Order {
  id?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  customer_name?: string;
  customer_email?: string;
  shipping_address?: string;
  payment_method: 'pix' | 'credit_card' | 'boleto';
  created_at?: Date;
}
