import { Router, type IRouter } from "express";
import { eq, desc, and, sql } from "drizzle-orm";
import { db, productsTable, categoriesTable, reviewsTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  ListProductsResponse,
  CreateProductBody,
  GetProductParams,
  GetProductResponse,
  UpdateProductParams,
  UpdateProductBody,
  UpdateProductResponse,
  DeleteProductParams,
  GetFeaturedProductsResponse,
  GetTopProductsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const withCategory = async (product: typeof productsTable.$inferSelect) => {
  const [cat] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, product.categoryId));
  return {
    ...product,
    price: Number(product.price),
    rating: Number(product.rating),
    categoryName: cat?.name ?? null,
  };
};

const withCategories = async (products: (typeof productsTable.$inferSelect)[]) => {
  const cats = await db.select().from(categoriesTable);
  const catMap = new Map(cats.map(c => [c.id, c.name]));
  return products.map(p => ({
    ...p,
    price: Number(p.price),
    rating: Number(p.rating),
    categoryName: catMap.get(p.categoryId) ?? null,
  }));
};

router.get("/products/featured", async (req, res): Promise<void> => {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isFeatured, true))
    .orderBy(desc(productsTable.rating))
    .limit(6);
  const enriched = await withCategories(products);
  res.json(GetFeaturedProductsResponse.parse(enriched));
});

router.get("/products/top", async (req, res): Promise<void> => {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isAvailable, true))
    .orderBy(desc(productsTable.rating))
    .limit(8);
  const enriched = await withCategories(products);
  res.json(GetTopProductsResponse.parse(enriched));
});

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { categoryId, search } = parsed.data;

  const conditions = [];
  if (categoryId != null) conditions.push(eq(productsTable.categoryId, categoryId));
  if (search) conditions.push(sql`${productsTable.name} ILIKE ${'%' + search + '%'}`);

  const products = await db
    .select()
    .from(productsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(productsTable.name);

  const enriched = await withCategories(products);
  res.json(ListProductsResponse.parse(enriched));
});

router.post("/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [product] = await db.insert(productsTable).values({
    ...parsed.data,
    price: String(parsed.data.price),
  }).returning();

  const enriched = await withCategory(product);
  res.status(201).json(GetProductResponse.parse(enriched));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetProductParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, params.data.id));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const enriched = await withCategory(product);
  res.json(GetProductResponse.parse(enriched));
});

router.patch("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateProductParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
  if (parsed.data.price !== undefined) updateData.price = String(parsed.data.price);

  const [product] = await db
    .update(productsTable)
    .set(updateData)
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const enriched = await withCategory(product);
  res.json(UpdateProductResponse.parse(enriched));
});

router.delete("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteProductParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db.delete(productsTable).where(eq(productsTable.id, params.data.id)).returning();
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
