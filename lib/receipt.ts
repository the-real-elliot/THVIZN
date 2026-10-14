import { STAR_LOGO_BASE64 } from "./star-logo-base64";

export interface ReceiptOrder {
  orderNumber: string | number;
  createdAt?: string | number | Date;
  orderStatus?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  trackingId?: string;
  items?: Array<{
    name: string;
    size?: string;
    quantity: number;
    price: number;
  }>;
  subtotal?: number;
  total: number;
  discount?: number;
  discountCode?: string;
  shipping?: number;
  customerName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email?: string;
}

export function generateReceiptHtml(order: ReceiptOrder): string {
  const dateStr = new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const formattedTime = new Date(order.createdAt || Date.now()).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>THVIZN Official Drop Receipt - #${order.orderNumber}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @font-face {
      font-family: 'Soria';
      src: url('https://fonts.cdnfonts.com/s/78809/Soria-Bold.woff') format('woff');
      font-weight: 700;
      font-style: normal;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #ffffff;
      color: #09090b;
      padding: 36px 24px;
      max-width: 680px;
      margin: 0 auto;
      line-height: 1.45;
      font-size: 13px;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #09090b;
      padding-bottom: 22px;
      margin-bottom: 24px;
    }
    .logo-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 10px;
    }
    .brand-logo {
      width: 58px;
      height: 58px;
      object-fit: contain;
      display: inline-block;
    }
    .brand-name {
      font-family: 'Outfit', -apple-system, sans-serif;
      font-size: 32px;
      font-weight: 900;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #09090b;
      line-height: 1;
    }
    .tagline {
      font-family: 'Soria', serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #52525b;
      text-transform: uppercase;
      margin-top: 6px;
    }
    .badge {
      font-family: 'Outfit', -apple-system, sans-serif;
      display: inline-block;
      background: #09090b;
      color: #ffffff;
      padding: 4px 14px;
      font-size: 10px;
      font-weight: 800;
      border-radius: 9999px;
      margin-top: 12px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .meta-box {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      font-size: 12px;
      margin-bottom: 24px;
      background: #fafafa;
      border: 1px solid #e4e4e7;
      border-radius: 8px;
      padding: 14px 18px;
    }
    .meta-col { line-height: 1.6; }
    .meta-col strong { color: #09090b; font-weight: 700; }
    .status-pill {
      display: inline-block;
      background: #dcfce7;
      color: #15803d;
      font-size: 9px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin: 18px 0;
      font-size: 12px;
    }
    .table th {
      text-align: left;
      border-bottom: 2px solid #09090b;
      padding: 10px 8px;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #71717a;
    }
    .table td {
      padding: 12px 8px;
      border-bottom: 1px solid #f4f4f5;
      vertical-align: middle;
    }
    .totals-box {
      margin-top: 16px;
      margin-left: auto;
      width: 290px;
      font-size: 12px;
      border-top: 1px dashed #e4e4e7;
      padding-top: 12px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      color: #52525b;
    }
    .totals-row.grand {
      font-family: 'Outfit', -apple-system, sans-serif;
      font-size: 15px;
      font-weight: 900;
      border-top: 2px solid #09090b;
      padding-top: 10px;
      margin-top: 8px;
      color: #09090b;
      letter-spacing: -0.01em;
    }
    .shipping-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 14px 18px;
      border-radius: 8px;
      margin-top: 24px;
      font-size: 12px;
      line-height: 1.6;
    }
    .shipping-title {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 6px;
    }
    .barcode-section {
      text-align: center;
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px dashed #e4e4e7;
    }
    .barcode {
      font-family: monospace;
      letter-spacing: 4px;
      font-size: 13px;
      font-weight: bold;
      color: #09090b;
    }
    .barcode-sub {
      font-size: 9px;
      color: #a1a1aa;
      letter-spacing: 1.5px;
      margin-top: 4px;
      text-transform: uppercase;
    }
    .footer {
      text-align: center;
      font-size: 10px;
      color: #71717a;
      margin-top: 24px;
      line-height: 1.6;
    }
    .no-print-bar {
      background: #09090b;
      color: white;
      padding: 10px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
    }
    .print-btn {
      background: #ffffff;
      color: #09090b;
      border: none;
      padding: 6px 14px;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      font-size: 11px;
      text-transform: uppercase;
    }
    @media print {
      body { padding: 0; }
      .no-print-bar { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <span>THVIZN Official Order Receipt #${order.orderNumber}</span>
    <button class="print-btn" onclick="window.print()">Print / Save PDF</button>
  </div>

  <div class="header">
    <div class="logo-wrap">
      <img src="${STAR_LOGO_BASE64}" class="brand-logo" alt="THVIZN Star Logo" />
      <span class="brand-name">THVIZN</span>
    </div>
    <div class="tagline">STREETWEAR ARCHIVE // INDIA • MUMBAI • TOKYO</div>
    <div class="badge">OFFICIAL DROP RECEIPT &amp; VERIFIED AUTHENTICITY</div>
  </div>

  <div class="meta-box">
    <div class="meta-col">
      <div><strong>ORDER ID:</strong> #${order.orderNumber}</div>
      <div><strong>DATE:</strong> ${dateStr} at ${formattedTime}</div>
      <div><strong>STATUS:</strong> <span class="status-pill">${order.orderStatus || "CONFIRMED"}</span></div>
    </div>
    <div class="meta-col" style="text-align: right;">
      <div><strong>PAYMENT:</strong> ${order.paymentMethod === "RAZORPAY_UPI" ? "Razorpay Prepaid (UPI / Cards)" : "Razorpay Prepaid (Verified)"}</div>
      <div><strong>PAYMENT STATUS:</strong> ${order.paymentStatus || "PAID"}</div>
      <div><strong>TRACKING AWB:</strong> ${order.trackingId || `TVZ-AWB-${order.orderNumber}`}</div>
    </div>
  </div>

  <table class="table">
    <thead>
      <tr>
        <th>Item Description</th>
        <th>Size</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${(order.items || []).map((it) => `
        <tr>
          <td><strong>${it.name}</strong></td>
          <td>${it.size || "M"}</td>
          <td style="text-align: center;">${it.quantity}</td>
          <td style="text-align: right;">Rs. ${((it.price || 0) * (it.quantity || 1)).toLocaleString("en-IN")}.00</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <div class="totals-box">
    <div class="totals-row">
      <span>Subtotal:</span>
      <span>Rs. ${(order.subtotal || order.total).toLocaleString("en-IN")}.00</span>
    </div>
    ${order.discount ? `
    <div class="totals-row" style="color: #e11d48; font-weight: 600;">
      <span>Discount (${order.discountCode || "PROMO"}):</span>
      <span>-Rs. ${order.discount.toLocaleString("en-IN")}.00</span>
    </div>
    ` : ""}
    <div class="totals-row">
      <span>Express Shipping:</span>
      <span style="font-weight: 700;">${order.shipping === 0 ? "FREE (PAN-INDIA)" : `Rs. ${order.shipping || 0}.00`}</span>
    </div>
    <div class="totals-row grand">
      <span>Total Paid:</span>
      <span>Rs. ${(order.total || 0).toLocaleString("en-IN")}.00</span>
    </div>
  </div>

  <div class="shipping-box">
    <div class="shipping-title">Shipping & Delivery Destination</div>
    <strong>${order.customerName}</strong><br>
    ${order.address}, ${order.city}, ${order.state} - ${order.pincode}<br>
    WhatsApp Phone: +91 ${order.phone} ${order.email ? `• Email: ${order.email}` : ""}
  </div>

  <div class="barcode-section">
    <div class="barcode">||||| | |||| ||| |||||| | || |||||||||| |||||</div>
    <div class="barcode-sub">AUTHENTICATED DROP PIECE // ID: ${order.orderNumber} // FW26 ARCHIVE</div>
  </div>

  <div class="footer">
    <p>Thank you for choosing THVIZN. True Style Never Dies.</p>
    <p>WhatsApp Concierge: +91 98765 43210 • Support: support@thvizn.in • Web: thvizn.in</p>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>`;
}

export function printOrderReceipt(order: ReceiptOrder): void {
  if (typeof window === "undefined") return;

  const receiptHtml = generateReceiptHtml(order);
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    // Popup was blocked by browser/mobile: fallback to direct file download
    try {
      const blob = new Blob([receiptHtml], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `THVIZN-Receipt-Order-${order.orderNumber}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert(`Receipt for Order #${order.orderNumber} has been downloaded to your device.`);
    } catch (e) {
      alert("Please allow popups in your browser to download/print your receipt.");
    }
    return;
  }

  printWindow.document.open();
  printWindow.document.write(receiptHtml);
  printWindow.document.close();
}
