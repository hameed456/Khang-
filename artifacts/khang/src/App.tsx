import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/use-cart";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import MenuPage from "@/pages/menu";
import Experience from "@/pages/experience";
import ProductDetail from "@/pages/product-detail";
import Checkout from "@/pages/checkout";
import OrderTracking from "@/pages/order-tracking";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Admin from "@/pages/admin";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/menu" component={MenuPage} />
        <Route path="/experience" component={Experience} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/order/:orderCode" component={OrderTracking} />
        <Route path="/order/track" component={OrderTracking} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
