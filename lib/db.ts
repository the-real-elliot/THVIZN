import fs from "fs";
import path from "path";
import { Product, Order, Coupon, SupportTicket, CustomerProfile, StoreSettings } from "./types";
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_COUPONS, INITIAL_SUPPORT_TICKETS } from "./products-data";

const DB_FILE = path.join(process.cwd(), "data-store.json");

export const DEFAULT_SETTINGS: StoreSettings = {
  announcementText: "FREE EXPRESS SHIPPING > ₹999 // USE CODE: TVZ10 FOR 10% OFF",
  promoCode: "TVZ10",
  hoverText: "CLICK TO COPY CODE [TVZ10] FOR 10% OFF",
  showAnnouncement: true
};

interface DataStore {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  supportTickets: SupportTicket[];
  settings?: StoreSettings;
}

function getStore(): DataStore {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      let needsSave = false;
      if (!parsed.coupons || !Array.isArray(parsed.coupons)) {
        parsed.coupons = INITIAL_COUPONS;
        needsSave = true;
      }
      if (!parsed.supportTickets || !Array.isArray(parsed.supportTickets)) {
        parsed.supportTickets = INITIAL_SUPPORT_TICKETS;
        needsSave = true;
      }
      if (!parsed.settings) {
        parsed.settings = DEFAULT_SETTINGS;
        needsSave = true;
      }
      if (needsSave) {
        saveStore(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.error("Error reading data-store.json:", err);
  }
  const defaultStore: DataStore = {
    products: INITIAL_PRODUCTS,
    orders: INITIAL_ORDERS,
    coupons: INITIAL_COUPONS,
    supportTickets: INITIAL_SUPPORT_TICKETS,
    settings: DEFAULT_SETTINGS
  };
  saveStore(defaultStore);
  return defaultStore;
}

function saveStore(store: DataStore) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving data-store.json:", err);
  }
}

// ================= PRODUCT METHODS =================
export function getAllProducts(): Product[] {
  return getStore().products;
}

export function getProductById(id: string): Product | undefined {
  return getStore().products.find(p => p.id === id || p.handle === id);
}

export function saveProduct(product: Product): Product {
  const store = getStore();
  const existingIdx = store.products.findIndex(p => p.id === product.id);
  if (existingIdx >= 0) {
    store.products[existingIdx] = product;
  } else {
    store.products.unshift(product);
  }
  saveStore(store);
  return product;
}

export function deleteProduct(id: string): boolean {
  const store = getStore();
  const initialLength = store.products.length;
  store.products = store.products.filter(p => p.id !== id && p.handle !== id);
  if (store.products.length !== initialLength) {
    saveStore(store);
    return true;
  }
  return false;
}

export function toggleProductStock(id: string): Product | null {
  const store = getStore();
  const prod = store.products.find(p => p.id === id || p.handle === id);
  if (!prod) return null;
  prod.inStock = !prod.inStock;
  saveStore(store);
  return prod;
}

// ================= ORDER METHODS =================
export function getAllOrders(): Order[] {
  return getStore().orders;
}

export function getOrderByIdOrPhone(identifier: string): Order | undefined {
  const store = getStore();
  const cleanId = identifier.trim().toUpperCase().replace(/^#/, "");
  return store.orders.find(
    o => o.orderNumber.toUpperCase().replace(/^#/, "") === cleanId ||
         o.id === identifier ||
         o.phone === identifier.trim()
  );
}

export function createOrder(orderData: Omit<Order, "id" | "orderNumber" | "createdAt">): Order {
  const store = getStore();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}`,
    orderNumber: `TVZ-${randomNum}`,
    createdAt: new Date().toISOString()
  };
  store.orders.unshift(newOrder);
  saveStore(store);
  return newOrder;
}

export function updateOrderStatus(
  orderId: string,
  status: Order["orderStatus"],
  trackingId?: string,
  courierName?: string
): Order | null {
  const store = getStore();
  const order = store.orders.find(o => o.id === orderId || o.orderNumber === orderId);
  if (!order) return null;
  order.orderStatus = status;
  if (trackingId !== undefined) order.trackingId = trackingId;
  if (courierName !== undefined) order.courierName = courierName;
  saveStore(store);
  return order;
}

// ================= CUSTOMER METHODS (WHO IS ORDERING) =================
export function getAllCustomers(): CustomerProfile[] {
  const store = getStore();
  const customerMap = new Map<string, CustomerProfile>();

  store.orders.forEach(order => {
    const key = (order.phone || order.email || order.customerName).trim().toLowerCase();
    const existing = customerMap.get(key);
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpent += order.total;
      existing.orders.push(order.orderNumber);
      if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = order.createdAt;
      }
    } else {
      customerMap.set(key, {
        name: order.customerName,
        email: order.email,
        phone: order.phone,
        city: order.city,
        state: order.state,
        totalOrders: 1,
        totalSpent: order.total,
        lastOrderDate: order.createdAt,
        orders: [order.orderNumber]
      });
    }
  });

  return Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}

// ================= COUPON METHODS =================
export function getAllCoupons(): Coupon[] {
  return getStore().coupons;
}

export function saveCoupon(couponData: Omit<Coupon, "id" | "createdAt" | "usageCount"> & { id?: string }): Coupon {
  const store = getStore();
  const upperCode = couponData.code.trim().toUpperCase();

  if (couponData.id) {
    const idx = store.coupons.findIndex(c => c.id === couponData.id);
    if (idx >= 0) {
      store.coupons[idx] = {
        ...store.coupons[idx],
        ...couponData,
        code: upperCode
      };
      saveStore(store);
      return store.coupons[idx];
    }
  }

  const existingIdx = store.coupons.findIndex(c => c.code === upperCode);
  if (existingIdx >= 0) {
    store.coupons[existingIdx] = {
      ...store.coupons[existingIdx],
      ...couponData,
      code: upperCode
    };
    saveStore(store);
    return store.coupons[existingIdx];
  }

  const newCoupon: Coupon = {
    id: `coup-${Date.now()}`,
    code: upperCode,
    title: couponData.title ? couponData.title.trim() : undefined,
    description: couponData.description ? couponData.description.trim() : undefined,
    type: couponData.type || "PERCENT",
    discountValue: Number(couponData.discountValue) || 10,
    minOrderAmount: Number(couponData.minOrderAmount) || 0,
    maxDiscount: couponData.maxDiscount ? Number(couponData.maxDiscount) : undefined,
    isActive: couponData.isActive !== false,
    usageCount: 0,
    maxUses: couponData.maxUses ? Number(couponData.maxUses) : undefined,
    expiryDate: couponData.expiryDate || undefined,
    createdAt: new Date().toISOString()
  };

  store.coupons.unshift(newCoupon);
  saveStore(store);
  return newCoupon;
}

export function toggleCouponActive(id: string): Coupon | null {
  const store = getStore();
  const coupon = store.coupons.find(c => c.id === id || c.code === id.toUpperCase());
  if (!coupon) return null;
  coupon.isActive = !coupon.isActive;
  saveStore(store);
  return coupon;
}

export function deleteCoupon(id: string): boolean {
  const store = getStore();
  const initLen = store.coupons.length;
  store.coupons = store.coupons.filter(c => c.id !== id && c.code !== id.toUpperCase());
  if (store.coupons.length !== initLen) {
    saveStore(store);
    return true;
  }
  return false;
}

export function validateCoupon(code: string, subtotal: number): {
  valid: boolean;
  discount: number;
  message?: string;
  coupon?: Coupon;
} {
  const store = getStore();
  const cleanCode = code.trim().toUpperCase();
  const coupon = store.coupons.find(c => c.code === cleanCode);

  if (!coupon) {
    return { valid: false, discount: 0, message: `Coupon "${cleanCode}" is invalid.` };
  }

  if (!coupon.isActive) {
    return { valid: false, discount: 0, message: `Coupon "${cleanCode}" is currently inactive.` };
  }

  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    return { valid: false, discount: 0, message: `Coupon "${cleanCode}" has expired.` };
  }

  if (coupon.maxUses && coupon.usageCount >= coupon.maxUses) {
    return { valid: false, discount: 0, message: `Coupon "${cleanCode}" has reached maximum usage limit.` };
  }

  if (subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order amount of ₹${coupon.minOrderAmount} required for coupon "${cleanCode}".`
    };
  }

  let discount = 0;
  if (coupon.type === "PERCENT") {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  // discount cannot exceed subtotal
  discount = Math.min(discount, subtotal);

  return {
    valid: true,
    discount,
    message: coupon.description
      ? `Coupon "${cleanCode}" applied: ${coupon.description} (₹${discount} saved)`
      : `Coupon "${cleanCode}" applied: ₹${discount} saved!`,
    coupon
  };
}

// ================= SUPPORT TICKET METHODS =================
export function getAllSupportTickets(): SupportTicket[] {
  return getStore().supportTickets;
}

export function createSupportTicket(
  ticketData: Omit<SupportTicket, "id" | "ticketNumber" | "createdAt" | "status">
): SupportTicket {
  const store = getStore();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newTicket: SupportTicket = {
    ...ticketData,
    id: `tck-${Date.now()}`,
    ticketNumber: `TCK-${randomNum}`,
    status: "OPEN",
    createdAt: new Date().toISOString(),
    adminReply: ""
  };
  store.supportTickets.unshift(newTicket);
  saveStore(store);
  return newTicket;
}

export function updateSupportTicketStatus(
  id: string,
  status: SupportTicket["status"],
  adminReply?: string
): SupportTicket | null {
  const store = getStore();
  const ticket = store.supportTickets.find(t => t.id === id || t.ticketNumber === id);
  if (!ticket) return null;
  ticket.status = status;
  if (adminReply !== undefined) ticket.adminReply = adminReply;
  saveStore(store);
  return ticket;
}

// ================= STORE SETTINGS METHODS =================
export function getStoreSettings(): StoreSettings {
  const store = getStore();
  return store.settings || DEFAULT_SETTINGS;
}

export function updateStoreSettings(updates: Partial<StoreSettings>): StoreSettings {
  const store = getStore();
  store.settings = {
    ...(store.settings || DEFAULT_SETTINGS),
    ...updates
  };
  saveStore(store);
  return store.settings;
}
