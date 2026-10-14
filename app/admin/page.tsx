"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Order, Product, Coupon, SupportTicket, CustomerProfile } from "@/lib/types";
import {
  ShieldCheck,
  Package,
  TrendingUp,
  Truck,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  Lock,
  DollarSign,
  Tag,
  Users,
  MessageSquare,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  MessageCircle,
  X,
  Search,
  Filter,
  Sliders,
  Eye,
  EyeOff
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "customers" | "catalogue" | "coupons" | "support" | "settings">("overview");

  // State data
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [storeSettings, setStoreSettings] = useState({
    announcementText: "FREE EXPRESS SHIPPING > ₹999 // USE CODE: TVZ10 FOR 10% OFF",
    promoCode: "TVZ10",
    hoverText: "CLICK TO COPY CODE [TVZ10] FOR 10% OFF",
    showAnnouncement: true
  });
  const [loading, setLoading] = useState(false);

  // Notifications
  const [notification, setNotification] = useState<string | null>(null);

  // Search / Filters
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState<string>("ALL");
  const [customerSearch, setCustomerSearch] = useState("");
  const [ticketFilter, setTicketFilter] = useState<string>("ALL");

  // Modal controls
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Editing order shipping
  const [editingOrderState, setEditingOrderState] = useState<{
    [id: string]: { status: Order["orderStatus"]; courier: string; tracking: string };
  }>({});

  // Coupon Generator Form
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    title: "",
    description: "",
    type: "PERCENT" as "PERCENT" | "FLAT",
    discountValue: 10,
    minOrderAmount: 999,
    maxDiscount: 500,
    maxUses: 100,
    expiryDate: "2026-12-31"
  });

  // New Product Form
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Oversized Tees" as Product["category"],
    tag: "NEW DROP",
    price: 1299,
    originalPrice: 1999,
    description: "",
    fabric: "100% Super Combed Terry Cotton",
    fit: "Relaxed Boxy Fit with Drop Shoulders",
    gsm: 280,
    stockCount: 40,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80",
    sizes: ["S", "M", "L", "XL"] as ("XS" | "S" | "M" | "L" | "XL" | "XXL")[]
  });

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === "admin") {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("thvizn_admin_auth", "true");
      }
      setAuthError("");
    } else {
      setAuthError("Access Denied: Invalid administrator password.");
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes, couponsRes, ticketsRes, customersRes, settingsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products"),
        fetch("/api/coupons"),
        fetch("/api/support"),
        fetch("/api/customers"),
        fetch("/api/settings")
      ]);

      const [ordersData, productsData, couponsData, ticketsData, customersData, settingsData] = await Promise.all([
        ordersRes.json(),
        productsRes.json(),
        couponsRes.json(),
        ticketsRes.json(),
        customersRes.json(),
        settingsRes.json()
      ]);

      if (settingsData?.settings) {
        setStoreSettings(settingsData.settings);
      }

      // Robust extraction for orders (handles both plain array and { success: true, orders: [...] })
      const parsedOrders: Order[] = Array.isArray(ordersData)
        ? ordersData
        : Array.isArray(ordersData?.orders)
        ? ordersData.orders
        : [];
      setOrders(parsedOrders);

      const map: any = {};
      parsedOrders.forEach((o: Order) => {
        map[o.id] = {
          status: o.orderStatus,
          courier: o.courierName || "Shiprocket / Delhivery",
          tracking: o.trackingId || ""
        };
      });
      setEditingOrderState(map);

      // Robust extraction for products
      const parsedProducts: Product[] = Array.isArray(productsData)
        ? productsData
        : Array.isArray(productsData?.products)
        ? productsData.products
        : [];
      setProducts(parsedProducts);

      // Robust extraction for coupons
      const parsedCoupons: Coupon[] = Array.isArray(couponsData)
        ? couponsData
        : Array.isArray(couponsData?.coupons)
        ? couponsData.coupons
        : [];
      setCoupons(parsedCoupons);

      // Robust extraction for support tickets / customer queries
      const parsedTickets: SupportTicket[] = Array.isArray(ticketsData)
        ? ticketsData
        : Array.isArray(ticketsData?.tickets)
        ? ticketsData.tickets
        : [];
      setTickets(parsedTickets);

      // Robust extraction for customers
      const parsedCustomers: CustomerProfile[] = Array.isArray(customersData)
        ? customersData
        : Array.isArray(customersData?.customers)
        ? customersData.customers
        : [];
      setCustomers(parsedCustomers);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Restore authenticated session on mount
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("thvizn_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data on login + auto-sync every 4 seconds for live incoming orders & queries
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
      const interval = setInterval(fetchAllData, 4000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Order update
  const handleUpdateOrder = async (orderId: string) => {
    const edit = editingOrderState[orderId];
    if (!edit) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: edit.status,
          trackingId: edit.tracking,
          courierName: edit.courier
        })
      });
      if (res.ok) {
        notify(`Order ${orderId} status updated to ${edit.status}`);
        fetchAllData();
      }
    } catch {
      notify("Failed to update order status");
    }
  };

  // Coupon create
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) {
      notify("Coupon code is required");
      return;
    }

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon)
      });
      if (res.ok) {
        notify(`Coupon code "${newCoupon.code.toUpperCase()}" generated successfully!`);
        setNewCoupon({
          code: "",
          title: "",
          description: "",
          type: "PERCENT",
          discountValue: 10,
          minOrderAmount: 999,
          maxDiscount: 500,
          maxUses: 100,
          expiryDate: "2026-12-31"
        });
        fetchAllData();
      }
    } catch {
      notify("Error generating coupon");
    }
  };

  // Toggle coupon active
  const handleToggleCoupon = async (id: string) => {
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: "PATCH" });
      if (res.ok) {
        notify("Coupon status updated");
        fetchAllData();
      }
    } catch {
      notify("Error toggling coupon");
    }
  };

  // Delete coupon
  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Permanently delete coupon "${code}"?`)) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        notify(`Coupon "${code}" deleted`);
        fetchAllData();
      }
    } catch {
      notify("Error deleting coupon");
    }
  };

  // Add Product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;

    const handle = newProduct.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const payload = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      handle,
      category: newProduct.category,
      tag: newProduct.tag,
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice),
      description: newProduct.description || `${newProduct.name} crafted in India with premium cotton.`,
      fabric: newProduct.fabric,
      fit: newProduct.fit,
      gsm: Number(newProduct.gsm),
      sizes: newProduct.sizes,
      images: [newProduct.image],
      inStock: true,
      stockCount: Number(newProduct.stockCount),
      featured: true
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        notify(`Product "${newProduct.name}" added to catalogue!`);
        setShowAddProductModal(false);
        setNewProduct({
          name: "",
          category: "Oversized Tees",
          tag: "NEW DROP",
          price: 1299,
          originalPrice: 1999,
          description: "",
          fabric: "100% Super Combed Terry Cotton",
          fit: "Relaxed Boxy Fit with Drop Shoulders",
          gsm: 280,
          stockCount: 40,
          image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80",
          sizes: ["S", "M", "L", "XL"]
        });
        fetchAllData();
      }
    } catch {
      notify("Error adding product");
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently remove "${name}" from the store catalogue?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        notify(`Product "${name}" removed from catalogue`);
        fetchAllData();
      }
    } catch {
      notify("Failed to remove product");
    }
  };

  // Toggle Stock
  const handleToggleStock = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "PATCH" });
      if (res.ok) {
        notify("Stock status toggled");
        fetchAllData();
      }
    } catch {
      notify("Failed to update stock");
    }
  };

  // Support Ticket Status update
  const handleUpdateTicketStatus = async (ticketId: string, status: SupportTicket["status"], reply?: string) => {
    try {
      const res = await fetch(`/api/support/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminReply: reply })
      });
      if (res.ok) {
        notify(`Ticket status updated to ${status}`);
        fetchAllData();
      }
    } catch {
      notify("Failed to update support ticket");
    }
  };

  // Save Store Settings (Announcement Bar & Promo)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeSettings)
      });
      if (res.ok) {
        notify("Top announcement bar and promo code updated live!");
        fetchAllData();
      } else {
        notify("Error saving settings");
      }
    } catch {
      notify("Failed to save settings");
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === "PAID" ? o.total : o.total), 0);
  const paidOrdersCount = orders.length;
  const pendingShipments = orders.filter((o) => o.orderStatus === "PLACED" || o.orderStatus === "PACKED").length;
  const activeCouponsCount = coupons.filter(c => c.isActive).length;
  const openTicketsCount = tickets.filter(t => t.status === "OPEN").length;

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = orderFilter === "ALL" || order.orderStatus === orderFilter;
    const matchesSearch =
      !orderSearch ||
      order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.phone.includes(orderSearch) ||
      order.city.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filtered customers
  const filteredCustomers = customers.filter(c => {
    return (
      !customerSearch ||
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch) ||
      c.city.toLowerCase().includes(customerSearch.toLowerCase())
    );
  });

  // Filtered tickets
  const filteredTickets = tickets.filter(t => {
    return ticketFilter === "ALL" || t.status === ticketFilter;
  });

  // 1. Password Protection Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#fafafb]">
        <div className="max-w-md w-full bg-white border border-zinc-200 rounded-sm p-8 space-y-6 shadow-sm">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock size={20} />
            </div>
            <h1 className="text-xl font-black uppercase tracking-tight text-black">
              THVIZN // STORE ADMIN
            </h1>
            <p className="text-xs text-zinc-500">
              Orders, Customers, Catalogue, Coupons & Support Helpdesk
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded px-3 py-2.5 pr-10 text-sm text-black focus:outline-none focus:border-black font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded border border-red-200 font-medium flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black hover:bg-zinc-800 text-white font-black py-2.5 rounded text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              ACCESS ADMIN DASHBOARD
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafb] pb-20">
      {/* Top Banner & Title */}
      <div className="bg-white border-b border-zinc-200 sticky top-14 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center font-black text-xs tracking-wider">
              TVZ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black uppercase tracking-wider text-black">
                  THVIZN CONTROL CENTER
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1.5 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Live Sync Active (4s)</span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-mono">
                Port 3000 // data-store.json // Real-Time Orders & Support Desk
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="px-3 py-1.5 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              <span>Sync</span>
            </button>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-3.5 py-1.5 bg-[#c70018] hover:bg-red-600 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Drop</span>
            </button>

            <button
              onClick={() => {
                if (typeof window !== "undefined") sessionStorage.removeItem("thvizn_admin_auth");
                setIsAuthenticated(false);
              }}
              className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 rounded text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1 border-t border-zinc-100 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 shrink-0 transition-colors ${
              activeTab === "overview"
                ? "border-black text-black"
                : "border-transparent text-zinc-500 hover:text-black"
            }`}
          >
            <TrendingUp size={14} />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 shrink-0 transition-colors ${
              activeTab === "orders"
                ? "border-black text-black"
                : "border-transparent text-zinc-500 hover:text-black"
            }`}
          >
            <Package size={14} />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 shrink-0 transition-colors ${
              activeTab === "customers"
                ? "border-black text-black"
                : "border-transparent text-zinc-500 hover:text-black"
            }`}
          >
            <Users size={14} />
            <span>Customers ({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("catalogue")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 shrink-0 transition-colors ${
              activeTab === "catalogue"
                ? "border-black text-black"
                : "border-transparent text-zinc-500 hover:text-black"
            }`}
          >
            <Truck size={14} />
            <span>Catalogue ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("coupons")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 shrink-0 transition-colors ${
              activeTab === "coupons"
                ? "border-black text-black"
                : "border-transparent text-zinc-500 hover:text-black"
            }`}
          >
            <Tag size={14} />
            <span>Coupons ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("support")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 shrink-0 transition-colors ${
              activeTab === "support"
                ? "border-black text-black"
                : "border-transparent text-zinc-500 hover:text-black"
            }`}
          >
            <MessageSquare size={14} />
            <span>Support Tickets</span>
            {openTicketsCount > 0 && (
              <span className="bg-[#ff2a2a] text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {openTicketsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 shrink-0 transition-colors ${
              activeTab === "settings"
                ? "border-black text-black"
                : "border-transparent text-zinc-500 hover:text-black"
            }`}
          >
            <Sliders size={14} />
            <span>Announcement Bar</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111113] text-white px-4 py-3 rounded shadow-xl text-xs font-bold flex items-center gap-2 border border-zinc-700 animate-slide-up">
          <CheckCircle size={16} className="text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 border border-zinc-200 rounded-sm space-y-1">
                <div className="text-[11px] font-bold uppercase text-zinc-500 flex items-center justify-between">
                  <span>Gross Sales</span>
                  <DollarSign size={15} className="text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-black">₹{totalRevenue.toLocaleString("en-IN")}</div>
                <p className="text-[10px] text-zinc-400">Total order revenue</p>
              </div>

              <div className="bg-white p-5 border border-zinc-200 rounded-sm space-y-1">
                <div className="text-[11px] font-bold uppercase text-zinc-500 flex items-center justify-between">
                  <span>Total Orders</span>
                  <Package size={15} className="text-black" />
                </div>
                <div className="text-2xl font-black text-black">{paidOrdersCount}</div>
                <p className="text-[10px] text-zinc-400">100% Prepaid via Razorpay</p>
              </div>

              <div className="bg-white p-5 border border-zinc-200 rounded-sm space-y-1">
                <div className="text-[11px] font-bold uppercase text-zinc-500 flex items-center justify-between">
                  <span>Pending Dispatch</span>
                  <Truck size={15} className="text-amber-500" />
                </div>
                <div className="text-2xl font-black text-amber-600">{pendingShipments}</div>
                <p className="text-[10px] text-zinc-400">Awaiting AWB / tracking</p>
              </div>

              <div className="bg-white p-5 border border-zinc-200 rounded-sm space-y-1">
                <div className="text-[11px] font-bold uppercase text-zinc-500 flex items-center justify-between">
                  <span>Active Coupons</span>
                  <Tag size={15} className="text-[#ff2a2a]" />
                </div>
                <div className="text-2xl font-black text-[#ff2a2a]">{activeCouponsCount}</div>
                <p className="text-[10px] text-zinc-400">{coupons.reduce((s, c) => s + c.usageCount, 0)} redemptions</p>
              </div>

              <div className="bg-white p-5 border border-zinc-200 rounded-sm space-y-1 col-span-2 lg:col-span-1">
                <div className="text-[11px] font-bold uppercase text-zinc-500 flex items-center justify-between">
                  <span>Open Tickets</span>
                  <MessageSquare size={15} className="text-blue-500" />
                </div>
                <div className="text-2xl font-black text-blue-600">{openTicketsCount}</div>
                <p className="text-[10px] text-zinc-400">Customer care queue</p>
              </div>
            </div>

            {/* Quick Overview Sections: Live Orders, Support Queries & Coupons */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders List */}
              <div className="bg-white p-5 border border-zinc-200 rounded-sm space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-black">
                    RECENT ORDERS ({orders.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-[11px] font-bold text-[#c70018] hover:underline uppercase cursor-pointer"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-2.5">
                  {orders.length === 0 ? (
                    <p className="text-xs text-zinc-400 py-4 text-center">No orders placed yet.</p>
                  ) : (
                    orders.slice(0, 4).map((order) => (
                      <div
                        key={order.id}
                        className="p-3 bg-zinc-50 border border-zinc-200 rounded flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-mono font-bold text-black">{order.orderNumber}</div>
                          <div className="text-[11px] text-zinc-500">{order.customerName} • {order.city}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-black">₹{order.total}</div>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            order.orderStatus === "DELIVERED"
                              ? "bg-emerald-100 text-emerald-800"
                              : order.orderStatus === "SHIPPED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Incoming Customer Queries & Support Tickets */}
              <div className="bg-white p-5 border border-zinc-200 rounded-sm space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-black">
                    SUPPORT QUERIES ({tickets.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab("support")}
                    className="text-[11px] font-bold text-blue-600 hover:underline uppercase cursor-pointer"
                  >
                    Helpdesk →
                  </button>
                </div>
                <div className="space-y-2.5">
                  {tickets.length === 0 ? (
                    <p className="text-xs text-zinc-400 py-4 text-center">No customer queries recorded.</p>
                  ) : (
                    tickets.slice(0, 4).map((t) => (
                      <div
                        key={t.id}
                        className="p-3 bg-zinc-50 border border-zinc-200 rounded text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-black">{t.ticketNumber}</span>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            t.status === "OPEN" ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {t.status}
                          </span>
                        </div>
                        <div className="text-zinc-700 font-semibold truncate">{t.name}: {t.message}</div>
                        <div className="text-[10px] text-zinc-400 font-mono truncate">{t.phone} • {t.email}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Active Coupons Quick Glance */}
              <div className="bg-white p-5 border border-zinc-200 rounded-sm space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-black">
                    ACTIVE PROMO CODES
                  </h3>
                  <button
                    onClick={() => setActiveTab("coupons")}
                    className="text-[11px] font-bold text-[#c70018] hover:underline uppercase cursor-pointer"
                  >
                    Generate New →
                  </button>
                </div>
                <div className="space-y-2.5">
                  {coupons.filter(c => c.isActive).slice(0, 4).map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-zinc-50 border border-zinc-200 rounded flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-black bg-white px-2 py-1 rounded border border-zinc-300">
                          {c.code}
                        </span>
                        <span className="text-[11px] text-zinc-600">
                          {c.type === "PERCENT" ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                        </span>
                      </div>
                      <div className="text-right text-[11px] text-zinc-500 font-mono">
                        {c.usageCount} uses
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ORDERS MANAGEMENT ================= */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white p-4 border border-zinc-200 rounded-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search order #, customer, phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded pl-9 pr-3 py-1.5 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs">
                {["ALL", "PLACED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded font-bold uppercase tracking-wider text-[11px] transition-colors ${
                      orderFilter === st
                        ? "bg-black text-white"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-white p-12 text-center text-zinc-400 border border-zinc-200 rounded text-xs">
                  No orders match your filter criteria.
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const editState = editingOrderState[order.id] || {
                    status: order.orderStatus,
                    courier: order.courierName || "Shiprocket / Delhivery",
                    tracking: order.trackingId || ""
                  };

                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-zinc-200 rounded-sm p-5 space-y-4 shadow-xs"
                    >
                      {/* Top Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-sm text-black">
                            {order.orderNumber}
                          </span>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                            {order.paymentMethod === "RAZORPAY_UPI" ? "Razorpay Prepaid" : "Prepaid"}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            {new Date(order.createdAt).toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/91${order.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(order.customerName)},%20update%20regarding%20your%20THVIZN%20Order%20${order.orderNumber}:`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25D366] hover:bg-[#20ba59] text-white px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                          >
                            <MessageCircle size={13} />
                            <span>WhatsApp Customer</span>
                          </a>

                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="border border-zinc-300 hover:bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider"
                          >
                            Full Details
                          </button>
                        </div>
                      </div>

                      {/* Content Row */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                        {/* Customer Info */}
                        <div className="md:col-span-4 space-y-1">
                          <div className="font-bold text-black uppercase">{order.customerName}</div>
                          <div className="text-zinc-600 font-mono text-[11px]">{order.phone}</div>
                          <div className="text-zinc-500 text-[11px]">{order.email}</div>
                          <div className="text-zinc-600 text-[11px] pt-1">
                            {order.address}, {order.city}, {order.state} - {order.pincode}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="md:col-span-4 space-y-2 border-t md:border-t-0 md:border-l border-zinc-100 md:pl-4">
                          <div className="text-[11px] font-bold uppercase text-zinc-400">
                            Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                          </div>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="relative w-8 h-10 bg-zinc-100 rounded shrink-0 overflow-hidden">
                                <Image src={item.image} alt={item.name} fill sizes="32px" className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-black truncate text-[11px]">{item.name}</div>
                                <div className="text-[10px] text-zinc-500">
                                  Size: <strong className="text-black">{item.size}</strong> • Qty: {item.quantity} • ₹{item.price}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="font-black text-black pt-1 text-sm">
                            Total: ₹{order.total}
                          </div>
                        </div>

                        {/* Status & Shipping Control */}
                        <div className="md:col-span-4 space-y-2.5 bg-zinc-50 p-3 rounded border border-zinc-200">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                              Status
                            </label>
                            <select
                              value={editState.status}
                              onChange={(e) =>
                                setEditingOrderState({
                                  ...editingOrderState,
                                  [order.id]: { ...editState, status: e.target.value as any }
                                })
                              }
                              className="w-full bg-white border border-zinc-300 rounded p-1.5 text-xs text-black font-bold uppercase"
                            >
                              <option value="PLACED">Placed</option>
                              <option value="PACKED">Packed</option>
                              <option value="SHIPPED">Shipped</option>
                              <option value="DELIVERED">Delivered</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                              Courier Partner
                            </label>
                            <input
                              type="text"
                              value={editState.courier}
                              onChange={(e) =>
                                setEditingOrderState({
                                  ...editingOrderState,
                                  [order.id]: { ...editState, courier: e.target.value }
                                })
                              }
                              placeholder="e.g. BlueDart / Delhivery"
                              className="w-full bg-white border border-zinc-300 rounded p-1.5 text-xs text-black"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                              Tracking / AWB Number
                            </label>
                            <input
                              type="text"
                              value={editState.tracking}
                              onChange={(e) =>
                                setEditingOrderState({
                                  ...editingOrderState,
                                  [order.id]: { ...editState, tracking: e.target.value }
                                })
                              }
                              placeholder="e.g. BLUEDART-849204"
                              className="w-full bg-white text-black border border-zinc-300 rounded p-1.5 text-xs font-mono"
                            />
                          </div>

                          <button
                            onClick={() => handleUpdateOrder(order.id)}
                            className="w-full bg-black hover:bg-zinc-800 text-white font-black py-1.5 rounded text-[11px] uppercase tracking-wider transition-colors"
                          >
                            Save Status & Tracking
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: CUSTOMERS (WHO IS ORDERING) ================= */}
        {activeTab === "customers" && (
          <div className="space-y-6">
            <div className="bg-white p-4 border border-zinc-200 rounded-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-black">
                  CUSTOMER DIRECTORY ({customers.length} BUYERS)
                </h2>
                <p className="text-xs text-zinc-500">
                  Track who is placing drops, lifetime spend, and repeat street collectors.
                </p>
              </div>

              <div className="relative w-full md:w-72">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search buyer name, city, phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded pl-9 pr-3 py-1.5 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCustomers.map((cust, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 border border-zinc-200 rounded-sm space-y-3 relative hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-black text-black uppercase text-sm">{cust.name}</div>
                      <div className="text-xs text-zinc-500">{cust.city}, {cust.state}</div>
                    </div>

                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      cust.totalSpent > 10000
                        ? "bg-purple-100 text-purple-800"
                        : cust.totalOrders > 1
                        ? "bg-blue-100 text-blue-800"
                        : "bg-zinc-100 text-zinc-700"
                    }`}>
                      {cust.totalSpent > 10000 ? "VIP Whale" : cust.totalOrders > 1 ? "Repeat Buyer" : "New Collector"}
                    </span>
                  </div>

                  <div className="space-y-1 font-mono text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded border border-zinc-100">
                    <div>Phone: <strong className="text-black">{cust.phone}</strong></div>
                    <div>Email: <span className="text-zinc-500 text-[11px]">{cust.email}</span></div>
                    <div className="pt-1 border-t border-zinc-200 flex justify-between font-sans">
                      <span>Total Drops: <strong>{cust.totalOrders}</strong></span>
                      <span>Lifetime Spend: <strong className="text-black font-black">₹{cust.totalSpent}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-zinc-400 font-mono text-[10px]">
                      Last: {new Date(cust.lastOrderDate).toLocaleDateString("en-IN")}
                    </span>

                    <a
                      href={`https://wa.me/91${cust.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(cust.name)},%20THVIZN%20team%20here!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1 rounded font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                    >
                      <MessageCircle size={13} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: CATALOGUE (ADD / REMOVE STUFFS) ================= */}
        {activeTab === "catalogue" && (
          <div className="space-y-6">
            <div className="bg-white p-4 border border-zinc-200 rounded-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-black">
                  PRODUCT INVENTORY ({products.length} SILHOUETTES)
                </h2>
                <p className="text-xs text-zinc-500">
                  Manage active drops, toggle stock availability, or permanently delete items.
                </p>
              </div>

              <button
                onClick={() => setShowAddProductModal(true)}
                className="bg-black hover:bg-zinc-800 text-white px-4 py-2 rounded text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Plus size={15} />
                <span>Add New Drop</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white border border-zinc-200 rounded-sm overflow-hidden flex flex-col justify-between shadow-xs hover:border-black transition-colors"
                >
                  <div>
                    {/* Image Thumbnail */}
                    <div className="relative aspect-4/3 bg-zinc-100 overflow-hidden">
                      <Image
                        src={prod.images[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000"}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                          {prod.category}
                        </span>
                        {prod.tag && (
                          <span className="bg-[#ff2a2a] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                            {prod.tag}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-xs uppercase text-black line-clamp-1">
                        {prod.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-black">₹{prod.price}</span>
                        <span className="text-xs text-zinc-400 line-through">₹{prod.originalPrice}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">({prod.gsm} GSM)</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 line-clamp-2">
                        {prod.description}
                      </p>
                      <div className="text-[10px] text-zinc-400">
                        Sizes: {prod.sizes.join(", ")} • Stock: {prod.stockCount} units
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 pt-0 border-t border-zinc-100 flex items-center justify-between gap-2 mt-2">
                    <button
                      onClick={() => handleToggleStock(prod.id)}
                      className={`text-[11px] font-bold uppercase px-3 py-1.5 rounded transition-colors ${
                        prod.inStock
                          ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                      }`}
                    >
                      {prod.inStock ? "✓ In Stock" : "Sold Out"}
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(prod.id, prod.name)}
                      className="text-[11px] font-bold uppercase px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: COUPON GENERATOR ================= */}
        {activeTab === "coupons" && (
          <div className="space-y-8">
            {/* Create Coupon Generator Card */}
            <div className="bg-white p-6 border border-zinc-200 rounded-sm space-y-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-black flex items-center gap-2">
                  <Tag size={16} className="text-[#ff2a2a]" />
                  <span>GENERATE NEW PROMO CODE</span>
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Create discount codes for Instagram drops, VIP customers, or seasonal sales.
                </p>
              </div>

              <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STREET20, VIP500"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    className="w-full bg-white text-zinc-900 border border-zinc-300 rounded p-2 text-xs font-mono font-bold uppercase focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">
                    Coupon Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Streetwear Festival"
                    value={newCoupon.title}
                    onChange={(e) => setNewCoupon({ ...newCoupon, title: e.target.value })}
                    className="w-full bg-white text-zinc-900 border border-zinc-300 rounded p-2 text-xs font-semibold focus:outline-none focus:border-black"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-zinc-700 uppercase mb-1">
                    Description / Banner Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15% off for all VIP drop orders above ₹1499"
                    value={newCoupon.description}
                    onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                    className="w-full bg-white text-zinc-900 border border-zinc-300 rounded p-2 text-xs font-medium focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={newCoupon.type}
                    onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as any })}
                    className="w-full bg-white text-zinc-900 border border-zinc-300 rounded p-2 text-xs font-bold focus:outline-none focus:border-black"
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">
                    {newCoupon.type === "PERCENT" ? "Discount Percentage (%)" : "Flat Discount Amount (₹)"} *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                    className="w-full bg-white text-zinc-900 border border-zinc-300 rounded p-2 text-xs font-bold focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">
                    Minimum Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newCoupon.minOrderAmount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: Number(e.target.value) })}
                    className="w-full bg-white text-zinc-900 border border-zinc-300 rounded p-2 text-xs font-semibold focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newCoupon.maxDiscount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: Number(e.target.value) })}
                    placeholder="Optional cap e.g. 500"
                    className="w-full bg-white text-zinc-900 border border-zinc-300 rounded p-2 text-xs font-semibold focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">
                    Usage Limit (Max Uses)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newCoupon.maxUses}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: Number(e.target.value) })}
                    className="w-full bg-white text-zinc-900 border border-zinc-300 rounded p-2 text-xs font-semibold focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={newCoupon.expiryDate}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                    className="w-full bg-white text-zinc-900 border border-zinc-300 rounded p-2 text-xs font-semibold focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-black hover:bg-zinc-800 text-white font-black py-2.5 rounded uppercase tracking-wider text-xs transition-colors shadow-xs"
                  >
                    GENERATE PROMO CODE
                  </button>
                </div>
              </form>
            </div>

            {/* Coupons Table */}
            <div className="bg-white border border-zinc-200 rounded-sm overflow-hidden">
              <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-black">
                  EXISTING PROMO CODES ({coupons.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5">Code & Description</th>
                      <th className="p-3.5">Type & Value</th>
                      <th className="p-3.5">Min Order</th>
                      <th className="p-3.5">Uses Count</th>
                      <th className="p-3.5">Expiry</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {coupons.map((c) => (
                      <tr key={c.id} className="hover:bg-zinc-50/50">
                        <td className="p-3.5">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-black bg-zinc-100 px-2.5 py-1 rounded border border-zinc-200">
                                {c.code}
                              </span>
                              {c.title && (
                                <span className="font-bold text-zinc-800 text-xs">
                                  {c.title}
                                </span>
                              )}
                            </div>
                            {c.description && (
                              <span className="text-[11px] text-zinc-500">
                                {c.description}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 font-bold text-black">
                          {c.type === "PERCENT" ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                          {c.maxDiscount ? ` (Cap ₹${c.maxDiscount})` : ""}
                        </td>
                        <td className="p-3.5 text-zinc-600 font-mono">
                          {c.minOrderAmount > 0 ? `₹${c.minOrderAmount}` : "None"}
                        </td>
                        <td className="p-3.5 font-mono text-zinc-700">
                          {c.usageCount} {c.maxUses ? `/ ${c.maxUses}` : ""}
                        </td>
                        <td className="p-3.5 text-zinc-500 font-mono text-[11px]">
                          {c.expiryDate || "Never"}
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => handleToggleCoupon(c.id)}
                            className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                              c.isActive
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-zinc-200 text-zinc-600"
                            }`}
                          >
                            {c.isActive ? "Active" : "Paused"}
                          </button>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteCoupon(c.id, c.code)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete Coupon"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: CUSTOMER SUPPORT DESK ================= */}
        {activeTab === "support" && (
          <div className="space-y-6">
            <div className="bg-white p-4 border border-zinc-200 rounded-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-black">
                  CUSTOMER SUPPORT DESK ({tickets.length} TICKETS)
                </h2>
                <p className="text-xs text-zinc-500">
                  Customer inquiries submitted from the website contact & exchange form.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setTicketFilter(st)}
                    className={`px-3 py-1.5 rounded font-bold uppercase tracking-wider text-[11px] ${
                      ticketFilter === st
                        ? "bg-black text-white"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Tickets List */}
            <div className="space-y-4">
              {filteredTickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-white p-5 border border-zinc-200 rounded-sm space-y-3 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-xs text-black">{t.ticketNumber}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        t.status === "OPEN"
                          ? "bg-red-100 text-red-800"
                          : t.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {t.status}
                      </span>
                      {t.orderNumber && (
                        <span className="font-mono text-[11px] text-zinc-500">
                          Order: <strong>{t.orderNumber}</strong>
                        </span>
                      )}
                      <span className="text-[11px] text-zinc-400">
                        {new Date(t.createdAt).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/91${t.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(t.name)},%20THVIZN%20Support%20here%20regarding%20Ticket%20${t.ticketNumber}:`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] hover:bg-[#20ba59] text-white px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                    >
                      <MessageCircle size={13} />
                      <span>Reply on WhatsApp</span>
                    </a>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="font-bold text-black uppercase">{t.name} ({t.phone} • {t.email})</div>
                    <div className="font-semibold text-zinc-800">{t.subject}</div>
                    <div className="p-3 bg-zinc-50 rounded border border-zinc-200 text-zinc-700 leading-relaxed text-xs">
                      {t.message}
                    </div>
                  </div>

                  {/* Status update switcher */}
                  <div className="pt-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-zinc-500 font-bold uppercase text-[10px]">Update Status:</span>
                      <button
                        onClick={() => handleUpdateTicketStatus(t.id, "OPEN")}
                        className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-[10px] font-bold uppercase"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleUpdateTicketStatus(t.id, "IN_PROGRESS")}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase"
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => handleUpdateTicketStatus(t.id, "RESOLVED")}
                        className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold uppercase"
                      >
                        Resolved
                      </button>
                    </div>

                    {t.adminReply && (
                      <span className="text-[11px] text-zinc-500 italic">
                        Note: {t.adminReply}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 7: ANNOUNCEMENT BAR & SETTINGS ================= */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-white border border-zinc-200 rounded-sm p-6 space-y-6 shadow-xs">
              <div className="border-b pb-4">
                <div className="flex items-center gap-2">
                  <Sliders size={18} className="text-[#c70018]" />
                  <h2 className="text-sm font-black uppercase tracking-wider text-black">
                    TOP ANNOUNCEMENT BAR & PROMO SETTINGS
                  </h2>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Control the top announcement bar text, clickable promo code, and interactive hover text displayed on the THVIZN storefront.
                </p>
              </div>

              {/* Live Storefront Preview */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">
                  Live Storefront Preview
                </label>
                <div className="bg-[#030305] border border-zinc-800 rounded-lg p-3 text-center space-y-2">
                  <div className="text-[10px] text-zinc-400 uppercase font-mono tracking-widest">
                    Default View:
                  </div>
                  <div className="text-zinc-200 text-xs font-tech font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] animate-pulse" />
                    <span>{storeSettings.announcementText || "FREE EXPRESS SHIPPING > ₹999 // USE CODE: TVZ10 FOR 10% OFF"}</span>
                    <span className="text-[9px] text-zinc-500 font-mono">[CLICK TO COPY]</span>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-400 uppercase font-mono tracking-widest">
                    Hover State View:
                  </div>
                  <div className="text-white text-xs font-tech font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                    <Copy size={13} className="text-[#e11d48]" />
                    <span className="text-[#e11d48] font-bold">
                      {storeSettings.hoverText || `CLICK TO COPY CODE [${storeSettings.promoCode}] FOR 10% OFF`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Settings Form */}
              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">
                    Announcement Bar Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={storeSettings.announcementText}
                    onChange={(e) => setStoreSettings({ ...storeSettings, announcementText: e.target.value })}
                    placeholder="FREE EXPRESS SHIPPING > ₹999 // USE CODE: TVZ10 FOR 10% OFF"
                    className="w-full bg-white text-zinc-900 placeholder-zinc-400 border border-zinc-300 rounded p-2.5 text-xs font-mono font-bold focus:border-black outline-none"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    The primary text displayed in the header banner across all pages.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">
                      Promo Code (Click-to-Copy) *
                    </label>
                    <input
                      type="text"
                      required
                      value={storeSettings.promoCode}
                      onChange={(e) => setStoreSettings({ ...storeSettings, promoCode: e.target.value.toUpperCase() })}
                      placeholder="TVZ10"
                      className="w-full bg-white text-zinc-900 placeholder-zinc-400 border border-zinc-300 rounded p-2.5 text-xs font-mono font-bold uppercase focus:border-black outline-none"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">
                      The discount code copied to the visitor&apos;s clipboard when they click the banner.
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 uppercase mb-1">
                      Interactive Hover Text *
                    </label>
                    <input
                      type="text"
                      required
                      value={storeSettings.hoverText}
                      onChange={(e) => setStoreSettings({ ...storeSettings, hoverText: e.target.value })}
                      placeholder="CLICK TO COPY CODE [TVZ10] FOR 10% OFF"
                      className="w-full bg-white text-zinc-900 placeholder-zinc-400 border border-zinc-300 rounded p-2.5 text-xs font-mono font-bold focus:border-black outline-none"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Revealed when the cursor moves over the banner.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="showAnnouncementToggle"
                    checked={storeSettings.showAnnouncement}
                    onChange={(e) => setStoreSettings({ ...storeSettings, showAnnouncement: e.target.checked })}
                    className="w-4 h-4 text-[#c70018] rounded cursor-pointer"
                  />
                  <label htmlFor="showAnnouncementToggle" className="font-bold text-zinc-800 uppercase cursor-pointer">
                    Enable Top Announcement Bar on Storefront
                  </label>
                </div>

                {/* Quick Presets */}
                <div className="pt-3 border-t">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                    Quick Preset Streetwear Announcements:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setStoreSettings({
                        announcementText: "FREE EXPRESS SHIPPING > ₹999 // USE CODE: TVZ10 FOR 10% OFF",
                        promoCode: "TVZ10",
                        hoverText: "CLICK TO COPY CODE [TVZ10] FOR 10% OFF",
                        showAnnouncement: true
                      })}
                      className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded text-[11px] font-mono cursor-pointer"
                    >
                      TVZ10 (Free Ship &gt; ₹999)
                    </button>

                    <button
                      type="button"
                      onClick={() => setStoreSettings({
                        announcementText: "FW26 MIDNIGHT DROP // 20% OFF ALL HOODIES // CODE: ARCHIVE20",
                        promoCode: "ARCHIVE20",
                        hoverText: "CLICK TO COPY CODE [ARCHIVE20] FOR 20% OFF",
                        showAnnouncement: true
                      })}
                      className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded text-[11px] font-mono cursor-pointer"
                    >
                      ARCHIVE20 (20% Off Hoodies)
                    </button>

                    <button
                      type="button"
                      onClick={() => setStoreSettings({
                        announcementText: "FIRST ORDER SPECIAL // FLAT ₹300 OFF ABOVE ₹1999 // CODE: WELCOME300",
                        promoCode: "WELCOME300",
                        hoverText: "CLICK TO COPY CODE [WELCOME300] FOR ₹300 OFF",
                        showAnnouncement: true
                      })}
                      className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded text-[11px] font-mono cursor-pointer"
                    >
                      WELCOME300 (Flat ₹300 Off)
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-black hover:bg-zinc-800 text-white font-black rounded text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle size={14} />
                    <span>Save Announcement & Store Settings</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: ADD PRODUCT ================= */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-xl w-full rounded-sm p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-black">
                ADD NEW STREETWEAR DROP
              </h2>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-zinc-400 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-800 uppercase mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder='e.g. THVIZN // "METAVERSE" HEAVYWEIGHT TEE'
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-white text-zinc-900 placeholder-zinc-400 border border-zinc-300 rounded p-2.5 text-xs font-bold focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-800 uppercase mb-1">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                    className="w-full bg-white text-zinc-900 border border-zinc-300 rounded p-2.5 text-xs font-bold focus:outline-none focus:border-black"
                  >
                    <option value="Oversized Tees">Oversized Tees</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Acid Wash">Acid Wash</option>
                    <option value="Bottoms">Bottoms</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 uppercase mb-1">Drop Tag</label>
                  <input
                    type="text"
                    value={newProduct.tag}
                    onChange={(e) => setNewProduct({ ...newProduct, tag: e.target.value })}
                    placeholder="e.g. 280 GSM, NEW DROP"
                    className="w-full bg-white text-zinc-900 placeholder-zinc-400 border border-zinc-300 rounded p-2.5 text-xs font-semibold focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-zinc-800 uppercase mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full bg-white text-zinc-900 border border-zinc-300 rounded p-2.5 text-xs font-bold focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 uppercase mb-1">MRP Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-white text-zinc-900 border border-zinc-300 rounded p-2.5 text-xs font-bold focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 uppercase mb-1">GSM Weight *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.gsm}
                    onChange={(e) => setNewProduct({ ...newProduct, gsm: Number(e.target.value) })}
                    className="w-full bg-white text-zinc-900 border border-zinc-300 rounded p-2.5 text-xs font-bold focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-800 uppercase mb-1">Fabric & Fit</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newProduct.fabric}
                    onChange={(e) => setNewProduct({ ...newProduct, fabric: e.target.value })}
                    placeholder="100% Terry Cotton"
                    className="w-full bg-white text-zinc-900 placeholder-zinc-400 border border-zinc-300 rounded p-2.5 text-xs font-semibold focus:outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    value={newProduct.fit}
                    onChange={(e) => setNewProduct({ ...newProduct, fit: e.target.value })}
                    placeholder="Boxy Oversized Fit"
                    className="w-full bg-white text-zinc-900 placeholder-zinc-400 border border-zinc-300 rounded p-2.5 text-xs font-semibold focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-800 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Drop shoulder cut, durable ribbed collar, preshrunk fabric..."
                  className="w-full bg-white text-zinc-900 placeholder-zinc-400 border border-zinc-300 rounded p-2.5 text-xs font-medium focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full bg-white text-zinc-900 placeholder-zinc-400 border border-zinc-300 rounded p-2.5 text-xs font-mono focus:outline-none focus:border-black"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border border-zinc-300 rounded text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black hover:bg-zinc-800 text-white font-black rounded text-xs uppercase tracking-wider"
                >
                  Publish Drop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ORDER FULL DETAILS ================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-xl w-full rounded-sm p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-black">
                ORDER BREAKDOWN // {selectedOrderDetails.orderNumber}
              </h2>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-zinc-400 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-zinc-50 p-3 rounded border border-zinc-200 space-y-1">
                <div className="font-bold text-black uppercase">{selectedOrderDetails.customerName}</div>
                <div className="text-zinc-600 font-mono">{selectedOrderDetails.phone} • {selectedOrderDetails.email}</div>
                <div className="text-zinc-700 pt-1">
                  {selectedOrderDetails.address}, {selectedOrderDetails.city}, {selectedOrderDetails.state} - {selectedOrderDetails.pincode}
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold uppercase text-zinc-500 text-[11px]">Items Ordered</div>
                {selectedOrderDetails.items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-zinc-50 rounded border border-zinc-100">
                    <div className="relative w-10 h-12 bg-zinc-200 rounded overflow-hidden shrink-0">
                      <Image src={it.image} alt={it.name} fill sizes="40px" className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-black uppercase">{it.name}</div>
                      <div className="text-zinc-500 text-[11px]">Size: {it.size} • Qty: {it.quantity}</div>
                    </div>
                    <div className="font-black text-black">₹{it.price * it.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-1.5 text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{selectedOrderDetails.subtotal}</span>
                </div>
                {selectedOrderDetails.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-₹{selectedOrderDetails.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{selectedOrderDetails.shipping === 0 ? "FREE" : `₹${selectedOrderDetails.shipping}`}</span>
                </div>
                <div className="flex justify-between text-base font-black text-black pt-2 border-t">
                  <span>Total Paid</span>
                  <span>₹{selectedOrderDetails.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
