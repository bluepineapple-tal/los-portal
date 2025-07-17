"use client";

import { useEffect, useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { API_BASE_URL } from "@/lib/constants";

import { EditProductCategoryForm } from "./edit-product-category-form";
import { productCategoryTableColumns } from "./product-category-table-columns";
import { ProductCategoryDTO } from "./product-category.schema";
import { fetchApi } from "@/lib/fetch-api";

export function ProductCategoryList() {
  const [cats, setCats] = useState<ProductCategoryDTO[]>([]);
  const [editing, setEditing] = useState<ProductCategoryDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetchApi<ProductCategoryDTO[]>(
          `${API_BASE_URL}/product-categories`,
        );
        setCats(res);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading product categories…</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!cats.length) return <p>No categories found.</p>;

  return (
    <>
      <DataTable
        key={version}
        columns={productCategoryTableColumns}
        data={cats}
        meta={{ setEditing }}
      />

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent side="right" className="flex flex-col gap-6 w-[26rem]">
          {editing && (
            <>
              <SheetHeader>
                <SheetTitle>Edit “{editing.name}”</SheetTitle>
              </SheetHeader>

              <EditProductCategoryForm
                category={editing}
                onSuccess={(updated) => {
                  setCats((prev) =>
                    prev.map((c) => (c.id === updated.id ? updated : c)),
                  );
                  setVersion((v) => v + 1);
                  setEditing(null);
                }}
                onCancel={() => setEditing(null)}
              />
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
