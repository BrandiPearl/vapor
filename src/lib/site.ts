export const faqs = [
  {
    q: "What products do you sell?",
    a: "We sell disposable vapes, vape kits, vape pods, e-liquids, vape coils, and vape devices online in Australia.",
  },
  {
    q: "Can I buy vapes online in Australia?",
    a: "Yes, you can buy vapes online Australia through our store with a simple and hassle-free process.",
  },
  {
    q: "Do you deliver vapes across Australia?",
    a: "Yes, we offer fast and reliable vape delivery Australia-wide.",
  },
  {
    q: "Are your vape products authentic?",
    a: "All our vape products are sourced from reputable brands and regulated suppliers.",
  },
  {
    q: "Do you sell nicotine vapes?",
    a: "Yes, we offer nicotine vape products in compliance with Australian regulations.",
  },
  {
    q: "Are your vapes suitable for beginners?",
    a: "Yes, we stock easy-to-use disposable vapes and starter vape kits ideal for beginners.",
  },
  {
    q: "How long does delivery take?",
    a: "Delivery times vary by location, but most orders arrive within a few business days.",
  },
  {
    q: "Do you offer customer support?",
    a: "Yes, our support team is available to help with orders, products, and general enquiries.",
  },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop All" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/account", label: "My account" },
  { href: "/cart", label: "Cart" },
];

export const footerLinks = [
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy Policy" },
];

/** Customer chat channels */
export const TELEGRAM_USERNAME =
  process.env.NEXT_PUBLIC_TELEGRAM_USERNAME?.replace(/^@/, "") || "garyb300";

export const TELEGRAM_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_URL || `https://t.me/${TELEGRAM_USERNAME}`;

export const TELEGRAM_HANDLE = `@${TELEGRAM_USERNAME}`;

export function getWhatsAppContactUrl(prefill?: string) {
  const phone =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "";
  if (!phone) return null;
  const base = `https://wa.me/${phone}`;
  return prefill
    ? `${base}?text=${encodeURIComponent(prefill)}`
    : base;
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount);
}
