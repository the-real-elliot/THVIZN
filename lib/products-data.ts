import { Product, Order, Coupon, SupportTicket, TopCustomer } from "./types";

export const INITIAL_PRODUCTS: Product[] = [
  // ================= 1. OVERSIZED TEES (6 SPECIMENS) =================
  {
    id: "prod-1",
    name: 'THVIZN // "NORTH STAR" HEAVYWEIGHT OVERSIZED TEE',
    handle: "thvizn-north-star-heavyweight-tee",
    category: "Oversized Tees",
    tag: "SIGNATURE DROP",
    price: 1399,
    originalPrice: 2299,
    description: "Signature THVIZN 4-point star screenprint on high-density 260 GSM combed cotton. Enzyme garment washed with dropped shoulders, wide sleeves, and raw streetwear drape.",
    fabric: "100% Ring Spun Combed Terry Cotton",
    fit: "Oversized Streetwear Boxy Fit / Drop Shoulders",
    gsm: 260,
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop&q=80"
    ],
    detailImages: [
      { label: "FRONT OVERVIEW", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop&q=85" },
      { label: "COLLAR & NECKLINE DETAIL", url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&auto=format&fit=crop&q=85" },
      { label: "FABRIC QUALITY // 260 GSM WEAVE", url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200&auto=format&fit=crop&q=85" },
      { label: "ARMS & SLEEVE HEM", url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&auto=format&fit=crop&q=85" },
      { label: "SHOULDER SEAMS & SILHOUETTE", url: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=1200&auto=format&fit=crop&q=85" },
      { label: "BACK GRAPHIC & REAR PROFILE", url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&auto=format&fit=crop&q=85" }
    ],
    inStock: true,
    stockCount: 45,
    featured: true
  },
  {
    id: "prod-2",
    name: 'THVIZN // "OBSIDIAN ECHO" HEAVY BOXY TEE',
    handle: "thvizn-obsidian-echo-heavy-tee",
    category: "Oversized Tees",
    tag: "BESTSELLER",
    price: 1299,
    originalPrice: 1999,
    description: "Deep jet obsidian pigment with tone-on-tone high-density rubberized crest at center chest. 1.2-inch shape-retaining ribbed collar.",
    fabric: "100% Super Combed Compact Cotton",
    fit: "Relaxed Boxy Cut / Drop Shoulder",
    gsm: 280,
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&auto=format&fit=crop&q=80"
    ],
    detailImages: [
      { label: "FRONT OVERVIEW", url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&auto=format&fit=crop&q=85" },
      { label: "COLLAR & 1.2-INCH RIBBED NECK", url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200&auto=format&fit=crop&q=85" },
      { label: "FABRIC QUALITY // 280 GSM COMPACT", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop&q=85" },
      { label: "ARMS & DROP SLEEVE DRAPE", url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&auto=format&fit=crop&q=85" },
      { label: "SHOULDER SEAMS REINFORCED", url: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=1200&auto=format&fit=crop&q=85" },
      { label: "BACK PROFILE & REAR HEM", url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&auto=format&fit=crop&q=85" }
    ],
    inStock: true,
    stockCount: 38,
    featured: true
  },
  {
    id: "prod-3",
    name: 'THVIZN // "BONE WHITE" ESSENTIAL OVERSIZED TEE',
    handle: "thvizn-bone-white-essential-tee",
    category: "Oversized Tees",
    tag: "ESSENTIAL",
    price: 1199,
    originalPrice: 1899,
    description: "Raw unbleached ivory hue featuring gothic micro-typography across the upper back spine. Heavyweight yet ultra-breathable open-end weave.",
    fabric: "100% Organic Combed Terry Cotton",
    fit: "Wide Silhouette / Drop Shoulders",
    gsm: 250,
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 52,
    featured: true
  },
  {
    id: "prod-4",
    name: 'THVIZN // "METAVERSE SLIT" STREETWEAR TEE',
    handle: "thvizn-metaverse-slit-tee",
    category: "Oversized Tees",
    tag: "DROP 02",
    price: 1349,
    originalPrice: 2199,
    description: "Futuristic slit-eye emblem across the chest with crimson coordinates tag at bottom hem. Preshrunk to retain structural boxiness indefinitely.",
    fabric: "100% Premium Compact Cotton",
    fit: "Oversized Slouch Silhouette",
    gsm: 260,
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 29,
    featured: false
  },
  {
    id: "prod-5",
    name: 'THVIZN // "GOTHIC MONOLITH" OVERSIZED TEE',
    handle: "thvizn-gothic-monolith-tee",
    category: "Oversized Tees",
    tag: "LIMITED",
    price: 1499,
    originalPrice: 2499,
    description: "Archival gothic lettering with distressed plastisol screenprint across the back. Heavyweight drape tailored for layering over longline sleeves.",
    fabric: "100% Long Staple Combed Cotton",
    fit: "Extreme Drop Shoulder / Street Fit",
    gsm: 290,
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 19,
    featured: false
  },
  {
    id: "prod-6",
    name: 'THVIZN // "SPECTRE" NOIR MINIMALIST TEE',
    handle: "thvizn-spectre-noir-tee",
    category: "Oversized Tees",
    tag: "STREETWEAR",
    price: 1249,
    originalPrice: 1999,
    description: "Ultra-clean matte black aesthetic. Blind tonal silicone branding on left chest and reinforced double-needle stitched cuffs.",
    fabric: "100% Combed Terry Cotton",
    fit: "Square Boxy Silhouette",
    gsm: 250,
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1618354691229-88d47f285158?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 42,
    featured: false
  },

  // ================= 2. HOODIES (6 SPECIMENS) =================
  {
    id: "prod-7",
    name: 'THVIZN // "CYBER EYE" 420 GSM HEAVY HOODIE // OBSIDIAN',
    handle: "thvizn-cyber-eye-heavy-hoodie",
    category: "Hoodies",
    tag: "420 GSM FRENCH TERRY",
    price: 2499,
    originalPrice: 3999,
    description: "Ultra-heavyweight 420 GSM French Terry hoodie featuring the iconic THVIZN slit-eye graphic. Double-layered structured hood without cords, heavyweight ribbing.",
    fabric: "420 GSM Luxury French Terry Cotton",
    fit: "Structured Boxy Silhouette / Pre-shrunk",
    gsm: 420,
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 30,
    featured: true
  },
  {
    id: "prod-8",
    name: 'THVIZN // "DISTRESSED RED STAR" FULL ZIP HOODIE',
    handle: "thvizn-distressed-red-star-zip-hoodie",
    category: "Hoodies",
    tag: "WINTER 2026",
    price: 2699,
    originalPrice: 4299,
    description: "Custom antique silver two-way hardware zipper, micro-distressed pocket hems, and high-impact crimson star emblem across the back spine.",
    fabric: "380 GSM Heavyweight Cotton Fleece",
    fit: "Relaxed Boxy Cut / Drop Shoulder",
    gsm: 380,
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 18,
    featured: true
  },
  {
    id: "prod-9",
    name: 'THVIZN // "BONE ARCHIVE" OVERSIZED HOODIE',
    handle: "thvizn-bone-archive-hoodie",
    category: "Hoodies",
    tag: "BESTSELLER",
    price: 2399,
    originalPrice: 3799,
    description: "Unbleached raw bone tone crafted with zero chemical dyes. High-density embroidery on hood brim with kangaroo pass-through pocket.",
    fabric: "400 GSM Combed French Terry",
    fit: "Structured Drop Shoulder Silhouette",
    gsm: 400,
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 25,
    featured: true
  },
  {
    id: "prod-10",
    name: 'THVIZN // "BLOODLINE" OXBLOOD HOODIE // LIMITED',
    handle: "thvizn-bloodline-oxblood-hoodie",
    category: "Hoodies",
    tag: "LIMITED 40 PCS",
    price: 2599,
    originalPrice: 4199,
    description: "Deep arterial burgundy / oxblood dye. Features Japanese kanji woven patch at forearm and signature gothic four-point star on chest.",
    fabric: "420 GSM Ultra Heavy Cotton Fleece",
    fit: "Oversized Street Cut",
    gsm: 420,
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 14,
    featured: false
  },
  {
    id: "prod-11",
    name: 'THVIZN // "TACTICAL TECH" ZIP HOODIE // GRAPHITE',
    handle: "thvizn-tactical-tech-zip-hoodie",
    category: "Hoodies",
    tag: "TECHNICAL WEAR",
    price: 2799,
    originalPrice: 4499,
    description: "Dual waterproof zippered chest compartments, articulated elbow stitching, and heavyweight fleece interior lining for extreme cold.",
    fabric: "390 GSM Tech Cotton & Cordura Blend",
    fit: "Athletic Boxy Slouch",
    gsm: 390,
    sizes: ["M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 22,
    featured: false
  },
  {
    id: "prod-12",
    name: 'THVIZN // "PHANTOM GREY" CROPPED BOXY HOODIE',
    handle: "thvizn-phantom-grey-cropped-hoodie",
    category: "Hoodies",
    tag: "STREETWEAR",
    price: 2299,
    originalPrice: 3599,
    description: "Modern cropped street hem with wide billowing sleeves and exaggerated drop shoulders. Engineered for layered streetwear aesthetics.",
    fabric: "360 GSM Compact Terry Cotton",
    fit: "Cropped Boxy Silhouette",
    gsm: 360,
    sizes: ["XS", "S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 33,
    featured: false
  },

  // ================= 3. ACID WASH & MINERAL DYES (6 SPECIMENS) =================
  {
    id: "prod-13",
    name: 'THVIZN // "SIGHTLINE" HEAVY MINERAL ACID WASH TEE',
    handle: "thvizn-sightline-acid-wash-tee",
    category: "Acid Wash",
    tag: "DROP 02",
    price: 1399,
    originalPrice: 2199,
    description: "Intense volcanic mineral acid wash with high-contrast stone marbling. Ultra-soft peached handfeel with hand-distressed collar edges.",
    fabric: "100% Combed Terry Cotton",
    fit: "Drop Shoulder Oversized Fit",
    gsm: 260,
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 48,
    featured: true
  },
  {
    id: "prod-14",
    name: 'THVIZN // "CHARCOAL CRATER" ENZYME WASH TEE',
    handle: "thvizn-charcoal-crater-enzyme-tee",
    category: "Acid Wash",
    tag: "SIGNATURE WASH",
    price: 1449,
    originalPrice: 2299,
    description: "Custom dual-stage enzyme wash resulting in faded slate hues. Tonal metallic silver star emblem screenprint across the chest.",
    fabric: "100% Ring Spun Combed Cotton",
    fit: "Oversized Street Cut",
    gsm: 270,
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 35,
    featured: false
  },
  {
    id: "prod-15",
    name: 'THVIZN // "RUST & ASH" PIGMENT DYE TEE',
    handle: "thvizn-rust-ash-pigment-dye-tee",
    category: "Acid Wash",
    tag: "PIGMENT DYE",
    price: 1399,
    originalPrice: 2099,
    description: "Artisanal pigment dye process creating subtle highs and lows around the seams. Gets better and softer with every single machine wash.",
    fabric: "100% Cotton Heavy Jersey",
    fit: "Boxy Drop Shoulder",
    gsm: 250,
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 40,
    featured: false
  },
  {
    id: "prod-16",
    name: 'THVIZN // "SNOW ACID" STONEWASH OVERSIZED TEE',
    handle: "thvizn-snow-acid-stonewash-tee",
    category: "Acid Wash",
    tag: "STONEWASH",
    price: 1499,
    originalPrice: 2399,
    description: "High-contrast snow marble stonewash on charcoal black cotton. Archival THVIZN typography across lower spine.",
    fabric: "100% Combed Terry Cotton",
    fit: "Oversized Street Silhouette",
    gsm: 280,
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 26,
    featured: false
  },
  {
    id: "prod-17",
    name: 'THVIZN // "VOID BLEACH" DISTRESSED ACID TEE',
    handle: "thvizn-void-bleach-distressed-tee",
    category: "Acid Wash",
    tag: "HAND DISTRESSED",
    price: 1549,
    originalPrice: 2499,
    description: "Individual hand-sprayed bleach fading with micro-abrasions along collar and cuffs. Every single piece is a one-of-a-kind specimen.",
    fabric: "100% Compact Spun Cotton",
    fit: "Loose Streetwear Cut",
    gsm: 260,
    sizes: ["M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618354691229-88d47f285158?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 17,
    featured: false
  },
  {
    id: "prod-18",
    name: 'THVIZN // "OBLIVION" MINERAL GREY TEE',
    handle: "thvizn-oblivion-mineral-grey-tee",
    category: "Acid Wash",
    tag: "BESTSELLER",
    price: 1349,
    originalPrice: 2199,
    description: "Subtle industrial cement wash with crimson coordinates print at nape. Heavyweight drape tailored for high-fashion streetwear.",
    fabric: "100% Combed Terry Cotton",
    fit: "Boxy Drop Shoulder",
    gsm: 250,
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 31,
    featured: false
  },

  // ================= 4. BOTTOMS & CARGOS (6 SPECIMENS) =================
  {
    id: "prod-19",
    name: 'THVIZN // "TACTICAL EYE" RIPSTOP CARGO PANTS // OBSIDIAN',
    handle: "thvizn-tactical-cargo-pants",
    category: "Bottoms",
    tag: "LIMITED",
    price: 2199,
    originalPrice: 3499,
    description: "Deep modular cargo utility pockets, matte black hardware, and adjustable ankle cinch cords. Subtle red star woven tag on pocket flap.",
    fabric: "Ripstop Cotton Blend with 3% Elastane",
    fit: "Relaxed Straight-Leg with Ankle Cinch",
    gsm: 320,
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 22,
    featured: true
  },
  {
    id: "prod-20",
    name: 'THVIZN // "PARACHUTE 99" WIDE-LEG BOTTOMS // SHADOW',
    handle: "thvizn-parachute-99-wide-bottoms",
    category: "Bottoms",
    tag: "BAGGY SILHOUETTE",
    price: 2299,
    originalPrice: 3699,
    description: "Ultra-baggy parachute cut with knee dart articulation and bungee cord waist. Floats effortlessly over chunky streetwear sneakers.",
    fabric: "Technical Taslan Nylon & Cotton Blend",
    fit: "Extreme Baggy Parachute Silhouette",
    gsm: 280,
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 28,
    featured: true
  },
  {
    id: "prod-21",
    name: 'THVIZN // "DOUBLE KNEE" HEAVY UTILITY WORK PANTS',
    handle: "thvizn-double-knee-utility-pants",
    category: "Bottoms",
    tag: "HEAVYWEIGHT 380 GSM",
    price: 2499,
    originalPrice: 3899,
    description: "Reinforced double-knee panels with custom antique silver rivets. 380 GSM duck canvas washed for broken-in comfort right out of the box.",
    fabric: "100% Heavy Cotton Duck Canvas",
    fit: "Relaxed Straight Workwear Cut",
    gsm: 380,
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 16,
    featured: false
  },
  {
    id: "prod-22",
    name: 'THVIZN // "420 GSM FRENCH TERRY" SWEATPANTS // NOIR',
    handle: "thvizn-french-terry-heavy-sweatpants",
    category: "Bottoms",
    tag: "420 GSM LUXURY",
    price: 1999,
    originalPrice: 3299,
    description: "Ultra-heavyweight 420 GSM loopback cotton fleece. Thick ribbed cuffs with internal cotton drawcord and deep welt pockets.",
    fabric: "420 GSM Luxury French Terry Cotton",
    fit: "Relaxed Tapered Street Cut",
    gsm: 420,
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 35,
    featured: false
  },
  {
    id: "prod-23",
    name: 'THVIZN // "METRIC" MODULAR POCKET CARGOS // GRAPHITE',
    handle: "thvizn-metric-modular-cargo-pants",
    category: "Bottoms",
    tag: "STREETWEAR",
    price: 2349,
    originalPrice: 3599,
    description: "Eight individual storage compartments including zippered security pockets. Industrial webbing accents with D-ring attachment key loop.",
    fabric: "Durable Poly-Cotton Ripstop Weave",
    fit: "Slouchy Cargo Silhouette",
    gsm: 310,
    sizes: ["M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 20,
    featured: false
  },
  {
    id: "prod-24",
    name: 'THVIZN // "RAW EDGE" OVERSIZED BOX STREET SHORTS',
    handle: "thvizn-raw-edge-street-shorts",
    category: "Bottoms",
    tag: "SUMMER ARCHIVE",
    price: 1499,
    originalPrice: 2299,
    description: "Below-the-knee heavy French terry shorts with raw unhemmed edges. Extended cream drawstring and signature tonal star print on thigh.",
    fabric: "360 GSM French Terry Cotton",
    fit: "Wide-Leg Knee-Length Cut",
    gsm: 360,
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80"
    ],
    inStock: true,
    stockCount: 44,
    featured: false
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1",
    orderNumber: "TVZ-8429",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    customerName: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "9876543210",
    address: "Flat 402, Green Glen Layout, Bellandur",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560103",
    items: [
      {
        productId: "prod-1",
        name: 'THVIZN // "NORTH STAR" HEAVYWEIGHT OVERSIZED TEE',
        price: 1399,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80",
        size: "L",
        quantity: 1
      }
    ],
    subtotal: 1399,
    discount: 140,
    shipping: 0,
    total: 1259,
    paymentMethod: "RAZORPAY_UPI",
    paymentStatus: "PAID",
    orderStatus: "SHIPPED",
    courierName: "Delhivery Surface",
    trackingId: "DLH948291048",
    notes: "Please call before delivery"
  },
  {
    id: "ord-2",
    orderNumber: "TVZ-8430",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    customerName: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "9123456780",
    address: "B-12, Sector 18, Near Cyber City",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122002",
    items: [
      {
        productId: "prod-7",
        name: 'THVIZN // "CYBER EYE" 420 GSM HEAVY HOODIE // OBSIDIAN',
        price: 2499,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1000&auto=format&fit=crop&q=80",
        size: "M",
        quantity: 1
      }
    ],
    subtotal: 2499,
    discount: 0,
    shipping: 0,
    total: 2499,
    paymentMethod: "RAZORPAY_UPI",
    paymentStatus: "PAID",
    orderStatus: "PACKED",
    courierName: "Shiprocket Express",
    trackingId: "SR58291042"
  }
];

export function getProductByHandleOrId(handleOrId: string): Product | undefined {
  if (typeof window === "undefined") {
    try {
      const fs = require("fs");
      const path = require("path");
      const dbPath = path.join(process.cwd(), "data-store.json");
      if (fs.existsSync(dbPath)) {
        const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
        if (Array.isArray(data.products)) {
          const found = data.products.find((p: Product) => p.handle === handleOrId || p.id === handleOrId);
          if (found) return found;
        }
      }
    } catch {}
  }
  return INITIAL_PRODUCTS.find((p) => p.handle === handleOrId || p.id === handleOrId);
}

export function getProductDetailShots(product: Product): { label: string; url: string }[] {
  if (product.detailImages && product.detailImages.length > 0) {
    return product.detailImages;
  }
  const baseImg = product.images[0] || "/images/star-logo.png";
  const secondImg = product.images[1] || baseImg;
  const thirdImg = product.images[2] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop&q=85";
  const fourthImg = product.images[3] || "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200&auto=format&fit=crop&q=85";
  const fifthImg = product.images[4] || "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&auto=format&fit=crop&q=85";
  const sixthImg = product.images[5] || secondImg;

  return [
    { label: "FRONT OVERVIEW", url: baseImg },
    { label: "COLLAR & NECKLINE DETAIL", url: thirdImg },
    { label: `FABRIC QUALITY // ${product.gsm} GSM`, url: fourthImg },
    { label: "ARMS & SLEEVE HEM", url: fifthImg },
    { label: "SHOULDER SEAMS & SILHOUETTE", url: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=1200&auto=format&fit=crop&q=85" },
    { label: "BACK GRAPHIC & REAR PROFILE", url: sixthImg }
  ];
}

export const TOP_CUSTOMERS: TopCustomer[] = [
  {
    rank: 1,
    name: "Aarav S.",
    city: "Bengaluru, KA",
    orderCount: 14,
    totalSpent: 22890,
    badge: "DIAMOND COLLECTOR",
    favoriteCategory: "Heavyweight Hoodies",
    joinedDate: "Feb 2026",
  },
  {
    rank: 2,
    name: "Kabir M.",
    city: "Mumbai, MH",
    orderCount: 11,
    totalSpent: 16450,
    badge: "PLATINUM VIP",
    favoriteCategory: "Acid Wash Tees",
    joinedDate: "Jan 2026",
  },
  {
    rank: 3,
    name: "Rohan D.",
    city: "New Delhi, DL",
    orderCount: 9,
    totalSpent: 13200,
    badge: "GOLD MEMBER",
    favoriteCategory: "Oversized Tees",
    joinedDate: "Mar 2026",
  },
  {
    rank: 4,
    name: "Priya N.",
    city: "Gurugram, HR",
    orderCount: 8,
    totalSpent: 11800,
    badge: "GOLD MEMBER",
    favoriteCategory: "Tactical Bottoms",
    joinedDate: "Apr 2026",
  },
  {
    rank: 5,
    name: "Tanvi S.",
    city: "Pune, MH",
    orderCount: 6,
    totalSpent: 8990,
    badge: "SILVER MEMBER",
    favoriteCategory: "Oversized Tees",
    joinedDate: "May 2026",
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: "coup-1",
    code: "TVZ10",
    title: "10% Streetwear Discount",
    description: "10% off on all streetwear orders above ₹999",
    type: "PERCENT",
    discountValue: 10,
    minOrderAmount: 999,
    maxDiscount: 500,
    isActive: true,
    usageCount: 42,
    maxUses: 500,
    expiryDate: "2026-12-31",
    createdAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "coup-2",
    code: "DROP200",
    title: "Drop Flat ₹200 Off",
    description: "Flat ₹200 discount on orders above ₹1499",
    type: "FLAT",
    discountValue: 200,
    minOrderAmount: 1499,
    isActive: true,
    usageCount: 18,
    maxUses: 200,
    expiryDate: "2026-12-31",
    createdAt: "2026-02-14T10:00:00Z"
  },
  {
    id: "coup-3",
    code: "FIRSTDROP",
    title: "First Order 15%",
    description: "15% off for first-time streetwear buyers above ₹1199",
    type: "PERCENT",
    discountValue: 15,
    minOrderAmount: 1199,
    maxDiscount: 600,
    isActive: true,
    usageCount: 89,
    maxUses: 100,
    expiryDate: "2026-11-30",
    createdAt: "2026-03-01T08:30:00Z"
  },
  {
    id: "coup-4",
    code: "VIP500",
    title: "VIP Collector Pass",
    description: "Flat ₹500 off on heavyweight luxury drops above ₹3499",
    type: "FLAT",
    discountValue: 500,
    minOrderAmount: 3499,
    isActive: true,
    usageCount: 12,
    maxUses: 50,
    expiryDate: "2026-12-31",
    createdAt: "2026-03-10T14:15:00Z"
  },
  {
    id: "coup-5",
    code: "ARCHIVE25",
    title: "Archive Sale 25%",
    description: "25% off archive pieces above ₹2499 (Max ₹1000)",
    type: "PERCENT",
    discountValue: 25,
    minOrderAmount: 2499,
    maxDiscount: 1000,
    isActive: false,
    usageCount: 50,
    maxUses: 50,
    expiryDate: "2026-03-01",
    createdAt: "2026-02-15T09:00:00Z"
  }
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "tck-1",
    ticketNumber: "TCK-1042",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "9876543210",
    orderNumber: "TVZ-8429",
    subject: "Size exchange inquiry for Acid Wash Box Fit Tee",
    message: "Hey team, received my order today! The quality and print look insane, but I wanted to size up from M to L for a more oversized slouch drape. How do I initiate the exchange pickup?",
    status: "OPEN",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    adminReply: ""
  },
  {
    id: "tck-2",
    ticketNumber: "TCK-1041",
    name: "Dev Mehta",
    email: "dev.mehta@example.com",
    phone: "9811223344",
    orderNumber: "TVZ-7310",
    subject: "Courier delivery OTP confirmation",
    message: "Tracking says out for delivery via BlueDart today. Just wanted to confirm if the delivery agent requires an OTP for COD delivery?",
    status: "IN_PROGRESS",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    adminReply: "Hi Dev, BlueDart will share an SMS with the OTP 15 minutes before the agent reaches your doorstep."
  },
  {
    id: "tck-3",
    ticketNumber: "TCK-1039",
    name: "Rohan D.",
    email: "rohan.delhi@example.com",
    phone: "9988776655",
    orderNumber: "TVZ-6204",
    subject: "VIP Leaderboard Early Access link",
    message: "Hey THVIZN team, saw I am ranked #3 on the Drop Collectors Leaderboard! How do I get the exclusive VIP password for Friday's 420 GSM hoodie drop?",
    status: "RESOLVED",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    adminReply: "VIP early access SMS has been sent to your registered phone number. You get access 1 hour prior to public drop!"
  }
];
