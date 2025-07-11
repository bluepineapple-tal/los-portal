// This type is used to define the shape of our data.
export enum ProductCategoryStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISCONTINUED = "discontinued",
}
export interface ICreateProductCategory {
  name: string;
  description: string;
  status: ProductCategoryStatus;
}
