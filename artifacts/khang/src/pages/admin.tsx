import { useState } from "react";
import { motion } from "framer-motion";
import {
  useListProducts, getListProductsQueryKey,
  useListOrders, getListOrdersQueryKey,
  useUpdateOrderStatus,
  useDeleteProduct,
  useGetStats, getGetStatsQueryKey,
  useListCategories, getListCategoriesQueryKey,
  useCreateProduct,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw, Plus, Package, ShoppingBag, Star, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Tab = "overview" | "products" | "orders";
type OrderStatus = "received" | "preparing" | "out_for_delivery" | "delivered";

const statusColors: Record<string, string> = {
  received: "bg-blue-100 text-blue-700",
  preparing: "bg-amber-100 text-amber-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
};

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "received", label: "Received" },
  { value: "preparing", label: "Preparing" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
];

export default function Admin() {
  const [tab, setTab] = useState<Tab>("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats } = useGetStats({ query: { queryKey: getGetStatsQueryKey() } });
  const { data: products, isLoading: productsLoading } = useListProducts({}, { query: { queryKey: getListProductsQueryKey({}) } });
  const { data: orders, isLoading: ordersLoading } = useListOrders({ query: { queryKey: getListOrdersQueryKey() } });
  const { data: categories } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });

  const updateStatus = useUpdateOrderStatus();
  const deleteProduct = useDeleteProduct();
  const createProduct = useCreateProduct();

  const [newProduct, setNewProduct] = useState({ name: "", price: "", categoryId: "", imageUrl: "", description: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleStatusUpdate = (orderId: number, status: OrderStatus) => {
    updateStatus.mutate({ id: orderId, data: { status } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        toast({ title: "Status Updated", description: `Order status updated to ${status.replace(/_/g, " ")}.` });
      }
    });
  };

  const handleDelete = (productId: number, productName: string) => {
    deleteProduct.mutate({ id: productId }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey({}) });
        toast({ title: "Product Deleted", description: `${productName} has been removed.` });
      }
    });
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.categoryId) {
      toast({ title: "Missing fields", description: "Name, price, and category are required.", variant: "destructive" });
      return;
    }
    createProduct.mutate({
      data: {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        categoryId: parseInt(newProduct.categoryId, 10),
        imageUrl: newProduct.imageUrl || undefined,
        description: newProduct.description || undefined,
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey({}) });
        setNewProduct({ name: "", price: "", categoryId: "", imageUrl: "", description: "" });
        setShowAddForm(false);
        toast({ title: "Product Added", description: `${newProduct.name} added to menu.` });
      }
    });
  };

  const statCards = [
    { label: "Total Orders", value: stats?.totalOrders ?? 0, Icon: Package },
    { label: "Happy Customers", value: stats?.happyCustomers ?? 0, Icon: Users },
    { label: "Menu Items", value: stats?.menuItems ?? 0, Icon: ShoppingBag },
    { label: "Avg Rating", value: stats?.avgRating?.toFixed(1) ?? "—", Icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-4xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">Manage products, orders, and restaurant settings.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-10 border-b border-border">
          {(["overview", "products", "orders"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`tab-admin-${t}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
              {statCards.map(({ label, value, Icon }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center mb-3">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <p className="font-serif text-3xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</p>
                </motion.div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Recent Orders</h3>
              {orders?.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-sm text-foreground">#{order.orderCode}</p>
                    <p className="text-xs text-muted-foreground">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status] ?? "bg-muted text-muted-foreground"}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                    <p className="text-sm font-semibold text-foreground mt-1">${Number(order.total).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Products Tab */}
        {tab === "products" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">{products?.length ?? 0} items on menu</p>
              <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-primary text-white h-9 text-sm px-4" data-testid="button-add-product">
                <Plus size={16} className="mr-1" /> Add Product
              </Button>
            </div>

            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-6 mb-6"
              >
                <h3 className="font-semibold text-foreground mb-4">New Product</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input value={newProduct.name} onChange={e => setNewProduct(p => ({...p, name: e.target.value}))} placeholder="Product name *" className="h-10 px-3 border border-border rounded-md bg-background text-sm focus:ring-2 focus:ring-primary outline-none" />
                  <input value={newProduct.price} onChange={e => setNewProduct(p => ({...p, price: e.target.value}))} placeholder="Price (e.g. 4.50) *" type="number" step="0.01" className="h-10 px-3 border border-border rounded-md bg-background text-sm focus:ring-2 focus:ring-primary outline-none" />
                  <select value={newProduct.categoryId} onChange={e => setNewProduct(p => ({...p, categoryId: e.target.value}))} className="h-10 px-3 border border-border rounded-md bg-background text-sm focus:ring-2 focus:ring-primary outline-none">
                    <option value="">Select category *</option>
                    {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input value={newProduct.imageUrl} onChange={e => setNewProduct(p => ({...p, imageUrl: e.target.value}))} placeholder="Image URL" className="h-10 px-3 border border-border rounded-md bg-background text-sm focus:ring-2 focus:ring-primary outline-none" />
                  <input value={newProduct.description} onChange={e => setNewProduct(p => ({...p, description: e.target.value}))} placeholder="Description" className="h-10 px-3 border border-border rounded-md bg-background text-sm focus:ring-2 focus:ring-primary outline-none sm:col-span-2" />
                </div>
                <div className="flex gap-3 mt-4">
                  <Button onClick={handleAddProduct} disabled={createProduct.isPending} className="bg-primary text-white h-9 text-sm px-5">
                    {createProduct.isPending ? "Adding..." : "Add Product"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="h-9 text-sm px-5">Cancel</Button>
                </div>
              </motion.div>
            )}

            {productsLoading ? (
              <div className="space-y-3">{Array.from({length: 5}).map((_, i) => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}</div>
            ) : (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="text-left p-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Product</th>
                      <th className="text-left p-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Category</th>
                      <th className="text-left p-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Price</th>
                      <th className="text-left p-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Rating</th>
                      <th className="p-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((product) => (
                      <tr key={product.id} className="border-t border-border hover:bg-muted/20 transition-colors" data-testid={`row-product-${product.id}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <img src={product.imageUrl || "https://images.unsplash.com/photo-1559847844-5315695dadae?w=100"} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <p className="font-medium text-foreground line-clamp-1">{product.name}</p>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground hidden sm:table-cell">{product.categoryName}</td>
                        <td className="p-4 font-semibold text-primary">${Number(product.price).toFixed(2)}</td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">{product.rating} ({product.reviewCount})</td>
                        <td className="p-4">
                          <button onClick={() => handleDelete(product.id, product.name)} className="p-2 text-muted-foreground hover:text-destructive transition-colors" data-testid={`button-delete-product-${product.id}`}>
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {ordersLoading ? (
              <div className="space-y-4">{Array.from({length: 5}).map((_, i) => <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />)}</div>
            ) : orders?.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="font-serif text-2xl">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders?.map((order) => (
                  <motion.div
                    key={order.id}
                    layout
                    className="bg-card border border-border rounded-xl p-5"
                    data-testid={`card-order-${order.id}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold text-foreground">#{order.orderCode}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] ?? "bg-muted text-muted-foreground"}`}>
                            {order.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.customerName} · {order.customerPhone}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{order.deliveryAddress}</p>
                        <p className="font-bold text-primary mt-1">${Number(order.total).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {statusOptions.map(({ value, label }) => (
                          <button
                            key={value}
                            onClick={() => handleStatusUpdate(order.id, value)}
                            disabled={order.status === value}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                              order.status === value
                                ? "bg-primary text-white border-primary"
                                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                            }`}
                            data-testid={`button-status-${value}-${order.id}`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
