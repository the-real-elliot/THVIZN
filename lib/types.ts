export interface ProductDetailShot {
  label: string; // e.g. "Front Look", "Collar & Neckline", "Fabric Quality & Weave", "Arms & Sleeve Hem", "Shoulder Seams", "Back Graphic Print"
  url: string;
}

export interface Product {
  id: string;
  name: string;
  handle: string;
  category: "Oversized Tees" | "Hoodies" | "Acid Wash" | "Bottoms";
  tag?: string; // e.g. "HEAVYWEIGHT 280 GSM", "NEW DROP", "BESTSELLER"
  price: number;
  originalPrice: number;
  description: string;
  fabric: string; // e.g. "100% Super Combed Terry Cotton"
  fit: string; // e.g. "Relaxed Boxy Fit with Drop Shoulders"
  gsm: number; // e.g. 280
  sizes: ("XS" | "S" | "M" | "L" | "XL" | "XXL")[];
  images: string[];
  detailImages?: ProductDetailShot[];
  inStock: boolean;
  stockCount: number;
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. #TVZ-8429
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: "RAZORPAY_UPI" | string;
  paymentStatus: "PAID" | "PENDING" | "FAILED";
  orderStatus: "PLACED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  courierName?: string; // e.g. "Shiprocket / Delhivery"
  trackingId?: string;
  notes?: string;
}

export interface TopCustomer {
  rank: number;
  name: string;
  city: string;
  orderCount: number;
  totalSpent: number;
  badge: "DIAMOND COLLECTOR" | "PLATINUM VIP" | "GOLD MEMBER" | "SILVER MEMBER";
  favoriteCategory: string;
  joinedDate: string;
}

export interface Coupon {
  id: string;
  code: string; // uppercase e.g. "TVZ10", "STREET20", "DROP500"
  title?: string; // e.g. "10% Streetwear Discount"
  description?: string; // e.g. "10% off on all streetwear orders above ₹999"
  type: "PERCENT" | "FLAT";
  discountValue: number; // e.g. 10 (%) or 200 (flat ₹)
  minOrderAmount: number; // e.g. 999
  maxDiscount?: number; // optional cap for percentage
  isActive: boolean;
  usageCount: number;
  maxUses?: number;
  expiryDate?: string; // YYYY-MM-DD
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string; // e.g. #TCK-1042
  name: string;
  email: string;
  phone: string;
  orderNumber?: string;
  subject: string;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  adminReply?: string;
}

export interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  orders: string[]; // Order numbers
}

export interface StoreSettings {
  announcementText: string;
  promoCode: string;
  hoverText: string;
  showAnnouncement: boolean;
}
