"use server";

import { ProductService } from "@/lib/services/products";

export async function getSearchProducts() {
  return await ProductService.getProducts();
}
