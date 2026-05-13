import { Router, type IRouter } from "express";
import { eq, desc, avg } from "drizzle-orm";
import { db, reviewsTable, productsTable } from "@workspace/db";
import {
  GetProductReviewsParams,
  GetProductReviewsResponse,
  CreateProductReviewParams,
  CreateProductReviewBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/products/:id/reviews", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetProductReviewsParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.productId, params.data.id))
    .orderBy(desc(reviewsTable.createdAt));

  res.json(GetProductReviewsResponse.parse(reviews.map(r => ({ ...r, createdAt: r.createdAt.toISOString() }))));
});

router.post("/products/:id/reviews", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = CreateProductReviewParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = CreateProductReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [review] = await db
    .insert(reviewsTable)
    .values({ ...parsed.data, productId: params.data.id })
    .returning();

  // Update product rating and review count
  const allReviews = await db.select({ rating: reviewsTable.rating }).from(reviewsTable).where(eq(reviewsTable.productId, params.data.id));
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  await db.update(productsTable).set({
    rating: avgRating.toFixed(2),
    reviewCount: allReviews.length,
    updatedAt: new Date(),
  }).where(eq(productsTable.id, params.data.id));

  res.status(201).json({ ...review, createdAt: review.createdAt.toISOString() });
});

export default router;
