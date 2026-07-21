import fs from "fs";
import path from "path";
import { db } from "./db";
import { Category, Collection, Product, ProductVariant } from "@/types/product";

const categoriesList: Category[] = [
  { id: "cat-men", name: "Men", slug: "men" },
  { id: "cat-women", name: "Women", slug: "women" },
  { id: "cat-accessories", name: "Accessories", slug: "accessories" }
];

const collectionsList: Collection[] = [
  { id: "col-essentials", categoryId: "cat-men", name: "Essentials", slug: "essentials", coverImageUrl: "/assets/collections/essentials.jpg" },
  { id: "col-signature", categoryId: "cat-men", name: "Signature", slug: "signature", coverImageUrl: "/assets/collections/signature.jpg" },
  { id: "col-limited", categoryId: "cat-men", name: "Limited Edition", slug: "limited-edition", coverImageUrl: "/assets/collections/limited-edition.jpg" },
  { id: "col-seasonal", categoryId: "cat-men", name: "Seasonal Collection", slug: "seasonal", coverImageUrl: "/assets/collections/seasonal.jpg" },
  
  { id: "col-w-essentials", categoryId: "cat-women", name: "Essentials", slug: "women-essentials", coverImageUrl: "/assets/collections/essentials.jpg" },
  { id: "col-w-signature", categoryId: "cat-women", name: "Signature", slug: "women-signature", coverImageUrl: "/assets/collections/signature.jpg" },
  { id: "col-w-limited", categoryId: "cat-women", name: "Limited Edition", slug: "women-limited-edition", coverImageUrl: "/assets/collections/limited-edition.jpg" },
  { id: "col-w-seasonal", categoryId: "cat-women", name: "Seasonal Collection", slug: "women-seasonal", coverImageUrl: "/assets/collections/seasonal.jpg" }
];

const makeSlug = (name: string) => 
  name.toLowerCase().replace(/ /g, "-").replace(/'/g, "").replace(/&/g, "and").replace(/,/g, "");

// Helper to generate variants
function generateVariants(productId: string): ProductVariant[] {
  const colors = ["Stone", "Charcoal", "Olive", "Sand", "Cream", "Black"];
  const sizes = ["XS", "S", "M", "L", "XL"];
  const list: ProductVariant[] = [];
  
  colors.forEach((color) => {
    sizes.forEach((size) => {
      list.push({
        id: `var-${productId}-${color.toLowerCase()}-${size.toLowerCase()}`,
        size,
        color,
        sku: `${productId}-${color.slice(0, 3).toUpperCase()}-${size}`,
        priceOverride: null,
        quantity: 12,
        status: "in_stock"
      });
    });
  });
  return list;
}

/**
 * Scan directory structure dynamically and build typed catalog from images.
 */
function buildDynamicCatalog(): Product[] {
  const products: Product[] = [];

  const menDir = path.join(process.cwd(), "public", "assets", "products", "men");
  if (fs.existsSync(menDir)) {
    const files = fs.readdirSync(menDir)
      .filter((f) => f.endsWith(".jpg") || f.endsWith(".jpeg") || f.endsWith(".png") || f.endsWith(".webp"))
      .sort();

    files.forEach((f, idx) => {
      let subCategory = "Apparel";
      let name = "Structured Campaign Item";
      
      const fileLower = f.toLowerCase();
      if (fileLower.includes("jacket")) {
        subCategory = "Outerwear";
        name = "Structured Wool Jacket";
      } else if (fileLower.includes("knitwear")) {
        subCategory = "Knitwear";
        name = "Superfine Merino Sweater";
      } else if (fileLower.includes("shirt")) {
        subCategory = "Shirts";
        name = "Crisp Cotton Poplin Shirt";
      } else if (fileLower.includes("t-shirt")) {
        subCategory = "T-Shirts";
        name = "Heavyweight Organic Tee";
      } else if (fileLower.includes("trouser")) {
        subCategory = "Trousers";
        name = "Tailored Straight-Leg Trouser";
      } else {
        const cleanName = f.slice(0, -4).replace(/-/g, " ");
        name = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        subCategory = "Apparel";
      }

      const slug = `${makeSlug(name)}-${f.slice(0, -4).toLowerCase()}`;
      const colIds = ["col-essentials", "col-signature", "col-limited", "col-seasonal"];
      const colId = colIds[idx % colIds.length];
      const pId = `prod-men-${f.slice(0, -4)}`;
      const basePrice = 5900 + ((idx + 1) * 2000);

      products.push({
        id: pId,
        categoryId: "cat-men",
        collectionId: colId,
        name,
        slug,
        description: `Cut from premium natural threads, this ${subCategory.toLowerCase()} represents Modeon's focus on structured tailoring and quiet luxury. Designed to endure years of standard use and seasonal rotations.`,
        basePrice,
        isNew: idx % 2 === 0,
        isBestSeller: idx % 3 === 0,
        isFeatured: idx % 4 === 0,
        isLimitedEdition: idx % 5 === 0,
        subCategory,
        variants: generateVariants(pId),
        media: [{
          id: `med-${pId}-1`,
          mediaType: "image",
          url: `/assets/products/men/${f}`,
          altText: name,
          sortOrder: 1
        }]
      });
    });
  }

  const womenDir = path.join(process.cwd(), "public", "assets", "products", "women");
  if (fs.existsSync(womenDir)) {
    const files = fs.readdirSync(womenDir)
      .filter((f) => f.endsWith(".jpg") || f.endsWith(".jpeg") || f.endsWith(".png") || f.endsWith(".webp"))
      .sort();

    files.forEach((f, idx) => {
      let subCategory = "Apparel";
      let name = "Women Campaign Selection";

      const fileLower = f.toLowerCase();
      if (fileLower.includes("dress")) {
        subCategory = "Dresses";
        name = "Asymmetric Drape Dress";
      } else if (fileLower.includes("outerwear")) {
        subCategory = "Outerwear";
        name = "Belted Cashmere Wrap Coat";
      } else if (fileLower.includes("shirt")) {
        subCategory = "Shirts";
        name = "Fluid Silk Crepe Shirt";
      } else if (fileLower.includes("top")) {
        subCategory = "Tops";
        name = "Ribbed Silk-Blend Top";
      } else if (fileLower.includes("trouser")) {
        subCategory = "Trousers";
        name = "Wide-Leg Pleated Trouser";
      } else {
        const cleanName = f.slice(0, -4).replace(/-/g, " ");
        name = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        subCategory = "Apparel";
      }

      const slug = `${makeSlug(name)}-${f.slice(0, -4).toLowerCase()}`;
      const colIds = ["col-w-essentials", "col-w-signature", "col-w-limited", "col-w-seasonal"];
      const colId = colIds[idx % colIds.length];
      const pId = `prod-women-${f.slice(0, -4)}`;
      const basePrice = 5900 + ((idx + 1) * 2000);

      products.push({
        id: pId,
        categoryId: "cat-women",
        collectionId: colId,
        name,
        slug,
        description: `Designed to drape cleanly on the feminine form, this ${subCategory.toLowerCase()} is spun from premium fibers. Muted tones and fine craftsmanship define this timeless collection piece.`,
        basePrice,
        isNew: idx % 2 === 1,
        isBestSeller: idx % 3 === 1,
        isFeatured: idx % 4 === 1,
        isLimitedEdition: idx % 5 === 1,
        subCategory,
        variants: generateVariants(pId),
        media: [{
          id: `med-${pId}-1`,
          mediaType: "image",
          url: `/assets/products/women/${f}`,
          altText: name,
          sortOrder: 1
        }]
      });
    });
  }

  let accDir = path.join(process.cwd(), "public", "assets", "products", "accessories");
  if (!fs.existsSync(accDir)) {
    accDir = path.join(process.cwd(), "public", "assets", "accessories");
  }

  if (fs.existsSync(accDir)) {
    const files = fs.readdirSync(accDir)
      .filter((f) => f.endsWith(".jpg") || f.endsWith(".jpeg") || f.endsWith(".png") || f.endsWith(".webp"))
      .sort();

    files.forEach((f, idx) => {
      let subCategory = "Accessories";
      let name = "Atelier Luxury Accessory";

      const fileLower = f.toLowerCase();
      if (fileLower.includes("bag")) {
        subCategory = "Bags";
        if (fileLower.includes("01")) name = "Classic Pebbled Leather Tote";
        else if (fileLower.includes("02")) name = "Box-Calf Saddle Shoulder Bag";
        else if (fileLower.includes("03")) name = "Smooth Leather Travel Duffel";
      } else if (fileLower.includes("shoes")) {
        subCategory = "Footwear";
        if (fileLower.includes("01")) name = "Suede Slip-On Loafer";
        else if (fileLower.includes("02")) name = "Soft Leather Chelsea Boot";
        else if (fileLower.includes("03")) name = "Handcrafted Penny Loafer";
      } else if (fileLower.includes("sunglasses")) {
        subCategory = "Eyewear";
        if (fileLower.includes("01")) name = "Hand-Polished Bio-Acetate Sunglasses";
        else if (fileLower.includes("02")) name = "Classic Round Tortoise Sunglasses";
        else if (fileLower.includes("03")) name = "Sculpted Metal Frame Sunglasses";
      } else if (fileLower.includes("watch")) {
        subCategory = "Accessories";
        if (fileLower.includes("01")) name = "Vegetable-Tanned Watch Roll Case";
        else if (fileLower.includes("02")) name = "Classic Chronograph Leather Watch";
        else if (fileLower.includes("03")) name = "Minimalist Black Dial Watch";
      } else {
        const cleanName = f.slice(0, -4).replace(/-/g, " ");
        name = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        subCategory = "Accessories";
      }

      const slug = `${makeSlug(name)}-${f.slice(0, -4).toLowerCase()}`;
      const colId = accCollections[idx % accCollections.length];
      const pId = `prod-acc-${f.slice(0, -4)}`;
      const basePrice = 4500 + ((idx + 1) * 1100);

      const mediaUrl = fs.existsSync(path.join(process.cwd(), "public", "assets", "products", "accessories"))
        ? `/assets/products/accessories/${f}`
        : `/assets/accessories/${f}`;

      products.push({
        id: pId,
        categoryId: "cat-accessories",
        collectionId: colId,
        name,
        slug,
        description: `Crafted with meticulous attention to detail, this daily accessory matches the core apparel designs of the Atelier catalog.`,
        basePrice,
        isNew: idx % 2 === 0,
        isBestSeller: idx % 3 === 0,
        isFeatured: idx % 4 === 0,
        isLimitedEdition: idx % 5 === 0,
        subCategory,
        variants: generateVariants(pId),
        media: [{
          id: `med-${pId}-1`,
          mediaType: "image",
          url: mediaUrl,
          altText: name,
          sortOrder: 1
        }]
      });
    });
  }

  return products;
}

const accCollections = [
  "col-essentials", "col-seasonal", "col-signature", "col-limited"
];

/**
 * Service to query dynamic product catalog data asynchronously from Database or Filesystem fallback.
 */
export const ProductService = {
  async getProducts(): Promise<Product[]> {
    try {
      const items = await db.product.findMany({
        include: { media: true, variants: true }
      });
      if (items.length > 0) {
        return items as unknown as Product[];
      }
    } catch {
      console.warn("ProductService: DB not seeded, falling back to FS catalog.");
    }
    return buildDynamicCatalog();
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const item = await db.product.findUnique({
        where: { slug },
        include: { media: true, variants: true }
      });
      if (item) return item as unknown as Product;
    } catch {
      console.warn("ProductService: DB not seeded, falling back to FS catalog.");
    }
    const products = buildDynamicCatalog();
    return products.find((p) => p.slug === slug) || null;
  },

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
      const items = await db.product.findMany({
        where: { categoryId },
        include: { media: true, variants: true }
      });
      if (items.length > 0) return items as unknown as Product[];
    } catch {
      console.warn("ProductService: DB not seeded, falling back to FS catalog.");
    }
    const products = buildDynamicCatalog();
    return products.filter((p) => p.categoryId === categoryId);
  },

  async getProductsByCollection(collectionId: string): Promise<Product[]> {
    try {
      const items = await db.product.findMany({
        where: { collectionId },
        include: { media: true, variants: true }
      });
      if (items.length > 0) return items as unknown as Product[];
    } catch {
      console.warn("ProductService: DB not seeded, falling back to FS catalog.");
    }
    const products = buildDynamicCatalog();
    return products.filter((p) => p.collectionId === collectionId);
  },

  async getCategories(): Promise<Category[]> {
    try {
      const items = await db.category.findMany();
      if (items.length > 0) return items as unknown as Category[];
    } catch {}
    return categoriesList;
  },

  async getCollections(): Promise<Collection[]> {
    try {
      const items = await db.collection.findMany();
      if (items.length > 0) return items as unknown as Collection[];
    } catch {}
    return collectionsList;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const items = await db.product.findMany({
        where: { isFeatured: true },
        include: { media: true, variants: true }
      });
      if (items.length > 0) return items as unknown as Product[];
    } catch {}
    const products = buildDynamicCatalog();
    return products.filter((p) => p.isFeatured);
  },

  async getBestSellers(): Promise<Product[]> {
    try {
      const items = await db.product.findMany({
        where: { isBestSeller: true },
        include: { media: true, variants: true }
      });
      if (items.length > 0) return items as unknown as Product[];
    } catch {}
    const products = buildDynamicCatalog();
    return products.filter((p) => p.isBestSeller);
  },

  async searchProducts(query: string): Promise<Product[]> {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    try {
      const items = await db.product.findMany({
        where: {
          OR: [
            { name: { contains: term, mode: "insensitive" } },
            { description: { contains: term, mode: "insensitive" } },
            { subCategory: { contains: term, mode: "insensitive" } }
          ]
        },
        include: { media: true, variants: true }
      });
      return items as unknown as Product[];
    } catch {}
    const products = buildDynamicCatalog();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.subCategory.toLowerCase().includes(term)
    );
  }
};
