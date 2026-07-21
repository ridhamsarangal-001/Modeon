import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categoriesList = [
  { id: "cat-men", name: "Men", slug: "men" },
  { id: "cat-women", name: "Women", slug: "women" },
  { id: "cat-accessories", name: "Accessories", slug: "accessories" }
];

const collectionsList = [
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

function generateVariants(productId: string) {
  const colors = ["Stone", "Charcoal", "Olive", "Sand", "Cream", "Black"];
  const sizes = ["XS", "S", "M", "L", "XL"];
  interface SeedVariant {
    id: string;
    size: string;
    color: string;
    sku: string;
    priceOverride: number | null;
    quantity: number;
    status: string;
  }
  const list: SeedVariant[] = [];
  
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

async function main() {
  console.log("Starting database seeding...");

  // 1. Seed Categories
  for (const cat of categoriesList) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
      }
    });
  }
  console.log("Categories seeded successfully.");

  // 2. Seed Collections
  for (const col of collectionsList) {
    await prisma.collection.upsert({
      where: { id: col.id },
      update: {},
      create: {
        id: col.id,
        name: col.name,
        slug: col.slug,
        coverImageUrl: col.coverImageUrl,
      }
    });
  }
  console.log("Collections seeded successfully.");

  // 3. Scan Men products and insert
  const menDir = path.join(process.cwd(), "public", "assets", "products", "men");
  if (fs.existsSync(menDir)) {
    const files = fs.readdirSync(menDir)
      .filter((f) => f.endsWith(".jpg") || f.endsWith(".jpeg") || f.endsWith(".png") || f.endsWith(".webp"))
      .sort();

    for (let idx = 0; idx < files.length; idx++) {
      const f = files[idx];
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
      }

      const slug = `${makeSlug(name)}-${f.slice(0, -4).toLowerCase()}`;
      const colIds = ["col-essentials", "col-signature", "col-limited", "col-seasonal"];
      const colId = colIds[idx % colIds.length];
      const pId = `prod-men-${f.slice(0, -4)}`;
      const basePrice = 5900 + ((idx + 1) * 2000);

      await prisma.product.upsert({
        where: { id: pId },
        update: {},
        create: {
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
          media: {
            create: [{
              id: `med-${pId}-1`,
              mediaType: "image",
              url: `/assets/products/men/${f}`,
              altText: name,
              sortOrder: 1
            }]
          },
          variants: {
            create: generateVariants(pId).map(v => ({
              id: v.id,
              size: v.size,
              color: v.color,
              sku: v.sku,
              quantity: v.quantity,
              status: v.status
            }))
          }
        }
      });
    }
  }

  // 4. Scan Women products and insert
  const womenDir = path.join(process.cwd(), "public", "assets", "products", "women");
  if (fs.existsSync(womenDir)) {
    const files = fs.readdirSync(womenDir)
      .filter((f) => f.endsWith(".jpg") || f.endsWith(".jpeg") || f.endsWith(".png") || f.endsWith(".webp"))
      .sort();

    for (let idx = 0; idx < files.length; idx++) {
      const f = files[idx];
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
      }

      const slug = `${makeSlug(name)}-${f.slice(0, -4).toLowerCase()}`;
      const colIds = ["col-w-essentials", "col-w-signature", "col-w-limited", "col-w-seasonal"];
      const colId = colIds[idx % colIds.length];
      const pId = `prod-women-${f.slice(0, -4)}`;
      const basePrice = 5900 + ((idx + 1) * 2000);

      await prisma.product.upsert({
        where: { id: pId },
        update: {},
        create: {
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
          media: {
            create: [{
              id: `med-${pId}-1`,
              mediaType: "image",
              url: `/assets/products/women/${f}`,
              altText: name,
              sortOrder: 1
            }]
          },
          variants: {
            create: generateVariants(pId).map(v => ({
              id: v.id,
              size: v.size,
              color: v.color,
              sku: v.sku,
              quantity: v.quantity,
              status: v.status
            }))
          }
        }
      });
    }
  }

  // 5. Scan Accessories products and insert
  let accDir = path.join(process.cwd(), "public", "assets", "products", "accessories");
  if (!fs.existsSync(accDir)) {
    accDir = path.join(process.cwd(), "public", "assets", "accessories");
  }

  if (fs.existsSync(accDir)) {
    const files = fs.readdirSync(accDir)
      .filter((f) => f.endsWith(".jpg") || f.endsWith(".jpeg") || f.endsWith(".png") || f.endsWith(".webp"))
      .sort();

    for (let idx = 0; idx < files.length; idx++) {
      const f = files[idx];
      let subCategory = "Accessories";
      let name = "Atelier Luxury Accessory";

      const fileLower = f.toLowerCase();
      if (fileLower.includes("bag")) {
        subCategory = "Bags";
        name = "Soft Structured Leather Bag";
      } else if (fileLower.includes("belt")) {
        subCategory = "Belts";
        name = "Classic Leather Belt";
      } else if (fileLower.includes("wallet")) {
        subCategory = "Wallets";
        name = "Fine Grain Cardholder";
      } else if (fileLower.includes("shoe") || fileLower.includes("boot") || fileLower.includes("sneaker")) {
        subCategory = "Shoes";
        name = "Minimalist Leather Sneaker";
      } else {
        const cleanName = f.slice(0, -4).replace(/-/g, " ");
        name = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      }

      const slug = `${makeSlug(name)}-${f.slice(0, -4).toLowerCase()}`;
      const pId = `prod-acc-${f.slice(0, -4)}`;
      const basePrice = 2900 + ((idx + 1) * 1500);

      await prisma.product.upsert({
        where: { id: pId },
        update: {},
        create: {
          id: pId,
          categoryId: "cat-accessories",
          collectionId: null,
          name,
          slug,
          description: `Handcrafted accessory featuring subtle hardware detail and fine edge painting. Designed to serve as a minimal accompaniment to modern luxury apparel edits.`,
          basePrice,
          isNew: idx % 2 === 0,
          isBestSeller: idx % 3 === 0,
          isFeatured: idx % 4 === 0,
          isLimitedEdition: idx % 5 === 0,
          subCategory,
          media: {
            create: [{
              id: `med-${pId}-1`,
              mediaType: "image",
              url: `/assets/products/accessories/${f}`,
              altText: name,
              sortOrder: 1
            }]
          },
          variants: {
            create: generateVariants(pId).map(v => ({
              id: v.id,
              size: v.size,
              color: v.color,
              sku: v.sku,
              quantity: v.quantity,
              status: v.status
            }))
          }
        }
      });
    }
  }

  // 6. Seed a Default Admin User for admin testing
  const adminPasswordHash = await bcrypt.hash("adminpassword123", 10);
  await prisma.user.upsert({
    where: { email: "admin@modeon.com" },
    update: {},
    create: {
      email: "admin@modeon.com",
      name: "Admin User",
      password: adminPasswordHash,
      role: "ADMIN"
    }
  });

  console.log("Seeding complete. Default admin created: admin@modeon.com / adminpassword123");
}

main()
  .catch((e) => {
    console.error("Error seeding database: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
