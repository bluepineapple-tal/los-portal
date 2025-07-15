"use client";

import { useSessionContext } from "supertokens-auth-react/recipe/session";

import { RequirePerm } from "@/components/auth/RequirePerm";
import { ProductCategoryList } from "@/components/product-categories/product-category-list";
import { Perm } from "@/lib/auth/permissions";

export const ProductCategoryPageTemplate = () => {
  const session = useSessionContext();

  if (session.loading) {
    return <div>Loading...</div>;
  }

  if (session.doesSessionExist === false) {
    return <div>Session does not exist</div>;
  }

  return (
    <RequirePerm perms={[Perm.PRODUCT_MANAGE]}>
      <div className="p-6">
        <h1 className="mb-4 text-xl font-bold">Product Categories</h1>

        <ProductCategoryList />
      </div>
    </RequirePerm>
  );
};
