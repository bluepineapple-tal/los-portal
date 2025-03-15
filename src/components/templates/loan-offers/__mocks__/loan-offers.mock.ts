import {
  IProductMake,
  IProductModel,
  ProductStatus,
} from "@/components/products/product.interface";

export const mockedProductMakes: IProductMake[] = [
  {
    id: "make-001",
    name: "Apple",
    description:
      "Leading technology company known for iPhones, MacBooks, and more.",
    status: ProductStatus.ACTIVE,
    created_at: new Date("2023-01-15T10:00:00Z"),
    updated_at: new Date("2024-02-01T12:30:00Z"),
  },
  {
    id: "make-002",
    name: "Samsung",
    description:
      "Global electronics brand producing smartphones, TVs, and semiconductors.",
    status: ProductStatus.ACTIVE,
    created_at: new Date("2023-02-10T09:30:00Z"),
    updated_at: new Date("2024-02-05T14:00:00Z"),
  },
  {
    id: "make-003",
    name: "OnePlus",
    description: "Premium smartphone brand known for flagship-level devices.",
    status: ProductStatus.ACTIVE,
    created_at: new Date("2023-03-20T14:45:00Z"),
    updated_at: new Date("2024-01-20T10:15:00Z"),
  },
  {
    id: "make-004",
    name: "Google",
    description:
      "Tech giant producing Pixel smartphones and smart home devices.",
    status: ProductStatus.ACTIVE,
    created_at: new Date("2023-04-05T11:10:00Z"),
    updated_at: new Date("2024-01-10T09:50:00Z"),
  },
  {
    id: "make-005",
    name: "Sony",
    description:
      "Japanese company known for PlayStation, TVs, and audio equipment.",
    status: ProductStatus.INACTIVE,
    created_at: new Date("2023-05-12T16:20:00Z"),
    updated_at: new Date("2024-02-01T12:00:00Z"),
  },
];

export const mockedProductModels: IProductModel[] = [
  {
    id: "model-001",
    productMake: mockedProductMakes.find((make) => make.id === "make-001"),
    name: "iPhone 16",
    description:
      "Latest flagship iPhone with advanced AI-powered camera system.",
    price: 1199.99,
    status: ProductStatus.ACTIVE,
    created_at: new Date("2024-01-15T08:00:00Z"),
    updated_at: new Date("2024-02-01T12:30:00Z"),
  },
  {
    id: "model-002",
    productMake: mockedProductMakes.find((make) => make.id === "make-001"),
    name: "MacBook Pro M3",
    description: "Powerful laptop with M3 chip and 16-core GPU.",
    price: 2499.99,
    status: ProductStatus.ACTIVE,
    created_at: new Date("2023-12-10T09:30:00Z"),
    updated_at: new Date("2024-02-05T14:00:00Z"),
  },
  {
    id: "model-003",
    productMake: mockedProductMakes.find((make) => make.id === "make-002"),
    name: "Galaxy S24 Ultra",
    description: "Samsung's latest flagship with a 200MP camera and S-Pen.",
    price: 1399.99,
    status: ProductStatus.ACTIVE,
    created_at: new Date("2024-01-05T14:45:00Z"),
    updated_at: new Date("2024-01-20T10:15:00Z"),
  },
  {
    id: "model-004",
    productMake: mockedProductMakes.find((make) => make.id === "make-002"),
    name: "Galaxy Z Fold 5",
    description: "Foldable phone with 120Hz AMOLED display.",
    price: 1799.99,
    status: ProductStatus.ACTIVE,
    created_at: new Date("2023-11-10T11:10:00Z"),
    updated_at: new Date("2024-01-10T09:50:00Z"),
  },
  {
    id: "model-005",
    productMake: mockedProductMakes.find((make) => make.id === "make-003"),
    name: "OnePlus 12",
    description:
      "Premium performance smartphone with Hasselblad-tuned cameras.",
    price: 899.99,
    status: ProductStatus.ACTIVE,
    created_at: new Date("2023-10-12T16:20:00Z"),
    updated_at: new Date("2024-02-01T12:00:00Z"),
  },
  {
    id: "model-006",
    productMake: mockedProductMakes.find((make) => make.id === "make-004"),
    name: "Pixel 8 Pro",
    description: "Google's AI-enhanced smartphone with Tensor G3 chip.",
    price: 999.99,
    status: ProductStatus.ACTIVE,
    created_at: new Date("2023-09-15T10:00:00Z"),
    updated_at: new Date("2024-01-20T14:15:00Z"),
  },
  {
    id: "model-007",
    productMake: mockedProductMakes.find((make) => make.id === "make-005"),
    name: "Xperia 1 V",
    description: "Sony's professional-grade smartphone with Alpha camera tech.",
    price: 1099.99,
    status: ProductStatus.INACTIVE,
    created_at: new Date("2023-08-05T08:30:00Z"),
    updated_at: new Date("2024-01-15T09:45:00Z"),
  },
];
