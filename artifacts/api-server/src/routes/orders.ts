import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, ordersTable, productsTable } from "@workspace/db";
import {
  ListOrdersResponse,
  CreateOrderBody,
  GetOrderParams,
  GetOrderResponse,
  UpdateOrderStatusParams,
  UpdateOrderStatusBody,
  UpdateOrderStatusResponse,
  TrackOrderParams,
  TrackOrderResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateOrderCode(): string {
  return "KH-" + Math.floor(1000 + Math.random() * 9000);
}

function formatOrder(order: typeof ordersTable.$inferSelect) {
  return {
    ...order,
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    deliveryFee: Number(order.deliveryFee),
    total: Number(order.total),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

router.get("/orders", async (req, res): Promise<void> => {
  const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  res.json(ListOrdersResponse.parse(orders.map(formatOrder)));
});

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { customerName, customerPhone, deliveryAddress, paymentMethod, items, notes } = parsed.data;

  // Fetch product details for each item
  const enrichedItems = [];
  let subtotal = 0;

  for (const item of items) {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId));
    if (!product) {
      res.status(400).json({ error: `Product ${item.productId} not found` });
      return;
    }
    const unitPrice = Number(product.price);
    const totalPrice = unitPrice * item.quantity;
    subtotal += totalPrice;
    enrichedItems.push({
      productId: item.productId,
      productName: product.name,
      quantity: item.quantity,
      unitPrice,
      totalPrice,
      imageUrl: product.imageUrl,
    });
  }

  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const deliveryFee = 5;
  const total = subtotal + tax + deliveryFee;

  const now = new Date();
  const estimatedDelivery = new Date(now.getTime() + 45 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const statusHistory = [
    {
      status: "received",
      timestamp: now.toISOString(),
      message: `Order accepted and sent to the kitchen at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    },
  ];

  const [order] = await db.insert(ordersTable).values({
    orderCode: generateOrderCode(),
    customerName,
    customerPhone,
    deliveryAddress,
    paymentMethod,
    status: "received",
    items: enrichedItems,
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    deliveryFee: deliveryFee.toFixed(2),
    total: total.toFixed(2),
    notes: notes ?? null,
    estimatedDelivery,
    statusHistory,
  }).returning();

  res.status(201).json(GetOrderResponse.parse(formatOrder(order)));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetOrderParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.id));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(GetOrderResponse.parse(formatOrder(order)));
});

router.patch("/orders/:id/status", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateOrderStatusParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.id));
  if (!existing) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const statusMessages: Record<string, string> = {
    received: "Order accepted and sent to the kitchen.",
    preparing: "Our chefs are hand-crafting your dim sum selection.",
    out_for_delivery: "Your order is on its way to you.",
    delivered: "Arrived at your specified sanctuary.",
  };

  const existingHistory = Array.isArray(existing.statusHistory) ? existing.statusHistory : [];
  const newHistory = [
    ...existingHistory,
    {
      status: parsed.data.status,
      timestamp: new Date().toISOString(),
      message: statusMessages[parsed.data.status] ?? "",
    },
  ];

  const [order] = await db
    .update(ordersTable)
    .set({ status: parsed.data.status, statusHistory: newHistory, updatedAt: new Date() })
    .where(eq(ordersTable.id, params.data.id))
    .returning();

  res.json(UpdateOrderStatusResponse.parse(formatOrder(order)));
});

router.get("/track/:orderId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.orderId) ? req.params.orderId[0] : req.params.orderId;
  const params = TrackOrderParams.safeParse({ orderId: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.orderCode, params.data.orderId));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const tracking = {
    orderCode: order.orderCode,
    customerName: order.customerName,
    status: order.status,
    items: order.items,
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.deliveryFee),
    total: Number(order.total),
    estimatedDelivery: order.estimatedDelivery,
    statusHistory: Array.isArray(order.statusHistory) ? order.statusHistory : [],
  };

  res.json(TrackOrderResponse.parse(tracking));
});

export default router;
