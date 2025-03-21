// This type is used to define the shape of our data.
export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISCONTINUED = "discontinued",
}

export interface IProductMake {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: ProductStatus;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateProductMake {
  name: string;
  description: string;
  status: ProductStatus;
}

export interface IProductModel {
  id: string;
  make?: IProductMake;
  name: string;
  slug: string;
  description: string;
  price: number;
  status: ProductStatus;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateProductModel {
  makeId: string;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
}
