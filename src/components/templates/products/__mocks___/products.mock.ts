import { ProductStatus } from "@/components/products/product-table";

export const productsMock = [
  {
    id: "1a2b3c4d-5678-90ab-cdef-1234567890ab",
    name: "Smartphone X12",
    description:
      "A high-end smartphone with a 6.5-inch OLED display and 128GB storage.",
    price: 699.99,
    status: ProductStatus.ACTIVE,
  },
  {
    id: "2b3c4d5e-6789-01ab-cdef-2345678901bc",
    name: "Wireless Headphones Pro",
    description:
      "Noise-canceling over-ear headphones with 40-hour battery life.",
    price: 299.99,
    status: ProductStatus.ACTIVE,
  },
  {
    id: "3c4d5e6f-7890-12ab-cdef-3456789012cd",
    name: "Gaming Laptop Z15",
    description: "Powerful gaming laptop with RTX 4070 GPU and 16GB RAM.",
    price: 1499.99,
    status: ProductStatus.ACTIVE,
  },
  {
    id: "4d5e6f70-8901-23ab-cdef-4567890123de",
    name: "4K Ultra HD Monitor",
    description: "27-inch IPS monitor with 144Hz refresh rate and HDR support.",
    price: 499.99,
    status: ProductStatus.ACTIVE,
  },
  {
    id: "5e6f7081-9012-34ab-cdef-5678901234ef",
    name: "Mechanical Keyboard MX",
    description:
      "RGB mechanical keyboard with customizable macros and Cherry MX switches.",
    price: 129.99,
    status: ProductStatus.INACTIVE,
  },
  {
    id: "6f708192-0123-45ab-cdef-6789012345f0",
    name: "Smartwatch Series 6",
    description:
      "Health-tracking smartwatch with GPS, heart rate, and sleep monitoring.",
    price: 249.99,
    status: ProductStatus.ACTIVE,
  },
  {
    id: "708192a3-1234-56ab-cdef-789012345601",
    name: "Portable SSD 1TB",
    description: "Ultra-fast NVMe external SSD with USB-C connectivity.",
    price: 179.99,
    status: ProductStatus.DISCONTINUED,
  },
  {
    id: "8192a3b4-2345-67ab-cdef-890123456712",
    name: "Smart Home Speaker",
    description: "Voice-controlled smart speaker with premium sound quality.",
    price: 99.99,
    status: ProductStatus.ACTIVE,
  },
  {
    id: "92a3b4c5-3456-78ab-cdef-901234567823",
    name: "Electric Standing Desk",
    description: "Height-adjustable standing desk with dual motors.",
    price: 399.99,
    status: ProductStatus.ACTIVE,
  },
  {
    id: "a3b4c5d6-4567-89ab-cdef-012345678934",
    name: "Wireless Ergonomic Mouse",
    description: "Comfortable ergonomic design with Bluetooth connectivity.",
    price: 59.99,
    status: ProductStatus.INACTIVE,
  },
];

export default productsMock;
