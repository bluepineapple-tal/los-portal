// This type is used to define the shape of our data.
export enum ProductCategoryStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISCONTINUED = "discontinued",
}

export interface IProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: ProductCategoryStatus;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateProductCategory {
  name: string;
  description: string;
  status: ProductCategoryStatus;
}
