export interface Order {
  orderNumber: string;
  product: string;
  price: number;
  date: string;
  paymentMethod: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalProducts: number;
}
