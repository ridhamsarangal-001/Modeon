import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/services/db";
import { Container } from "@/components/ui/Container";
import { HeadingH2 } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

interface DashboardOrder {
  id: string;
  createdAt: Date;
  totalPrice: number;
  status: string;
  user: {
    name: string | null;
    email: string;
  };
}

interface DashboardLowStock {
  id: string;
  size: string;
  color: string;
  sku: string;
  quantity: number;
  product: {
    name: string;
  };
}

/**
 * Protected Admin Sales Dashboard.
 * Role-based validation checks on mount.
 * Displays total revenue, order details, registered users, and active inventory status.
 */
export default async function AdminDashboard() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN") {
    redirect("/");
  }

  // Fetch admin metrics from database (with try-catch safety fallbacks)
  let ordersCount = 0;
  let totalRevenue = 0;
  let productsCount = 0;
  let usersCount = 0;
  let recentOrders: DashboardOrder[] = [];
  let lowStockVariants: DashboardLowStock[] = [];

  try {
    ordersCount = await db.order.count();
    const sales = await db.order.findMany({
      where: { status: { notIn: ["cancelled"] } },
      select: { totalPrice: true }
    });
    totalRevenue = sales.reduce((acc, order) => acc + order.totalPrice, 0);
    productsCount = await db.product.count();
    usersCount = await db.user.count();

    const ordersRaw = await db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true }
    });
    recentOrders = ordersRaw as unknown as DashboardOrder[];

    const variantsRaw = await db.productVariant.findMany({
      where: { quantity: { lte: 3 } },
      take: 5,
      include: { product: true }
    });
    lowStockVariants = variantsRaw as unknown as DashboardLowStock[];
  } catch {
    console.warn("AdminDashboard: DB tables not initialized or query failed.");
  }

  return (
    <Container className="py-space-8 select-none bg-background dark:bg-background-dark min-h-screen text-primary dark:text-[#F8F7F5] transition-colors duration-300">
      <div className="flex flex-col gap-space-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-space-4 border-b border-border dark:border-neutral-800 pb-space-4">
          <div>
            <HeadingH2 className="font-display uppercase tracking-widest">
              Atelier Dashboard
            </HeadingH2>
            <p className="font-sans text-small text-muted dark:text-neutral-400 mt-1">
              Store management, metrics tracking, and product dispatch control panel.
            </p>
          </div>
          <Badge variant="bestSeller">Logged in as {session.user.name || "Administrator"}</Badge>
        </div>

        {/* 4-Column Stat Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-4 mt-space-2">
          
          {/* Revenue */}
          <div className="bg-white dark:bg-[#1C1C1C] border border-border/40 dark:border-neutral-800 p-space-4 rounded-none flex flex-col gap-1 shadow-soft">
            <span className="font-sans text-micro tracking-widest uppercase text-muted dark:text-neutral-400">Total Net Revenue</span>
            <span className="font-display text-[28px] text-accent font-normal mt-1">
              ₹{totalRevenue.toLocaleString()}
            </span>
          </div>

          {/* Orders */}
          <div className="bg-white dark:bg-[#1C1C1C] border border-border/40 dark:border-neutral-800 p-space-4 rounded-none flex flex-col gap-1 shadow-soft">
            <span className="font-sans text-micro tracking-widest uppercase text-muted dark:text-neutral-400">Lifetime Orders</span>
            <span className="font-display text-[28px] text-neutral-950 dark:text-white font-normal mt-1">
              {ordersCount}
            </span>
          </div>

          {/* Products */}
          <div className="bg-white dark:bg-[#1C1C1C] border border-border/40 dark:border-neutral-800 p-space-4 rounded-none flex flex-col gap-1 shadow-soft">
            <span className="font-sans text-micro tracking-widest uppercase text-muted dark:text-neutral-400">Catalog Products</span>
            <span className="font-display text-[28px] text-neutral-950 dark:text-white font-normal mt-1">
              {productsCount}
            </span>
          </div>

          {/* Users */}
          <div className="bg-white dark:bg-[#1C1C1C] border border-border/40 dark:border-neutral-800 p-space-4 rounded-none flex flex-col gap-1 shadow-soft">
            <span className="font-sans text-micro tracking-widest uppercase text-muted dark:text-neutral-400">Registered Users</span>
            <span className="font-display text-[28px] text-neutral-950 dark:text-white font-normal mt-1">
              {usersCount}
            </span>
          </div>

        </div>

        {/* 2-Column Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-6 mt-space-4">
          
          {/* Left Panel: Recent Orders */}
          <div className="bg-white dark:bg-[#1C1C1C] border border-border/40 dark:border-neutral-800 p-space-5 shadow-soft flex flex-col gap-space-4">
            <h3 className="font-display text-h3 uppercase tracking-wider text-neutral-900 dark:text-[#F8F7F5]">
              Recent Orders Log
            </h3>
            
            {recentOrders.length === 0 ? (
              <p className="font-sans text-body text-muted dark:text-neutral-400 py-space-3 italic">
                No orders registered in the system yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {recentOrders.map((o) => (
                  <div key={o.id} className="flex flex-col sm:flex-row justify-between sm:items-center py-2 border-b border-border/40 dark:border-neutral-800 last:border-0 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="font-sans text-body font-medium text-neutral-900 dark:text-white">
                        {o.user.name || o.user.email}
                      </span>
                      <span className="font-sans text-micro text-muted dark:text-neutral-400">
                        ID: {o.id.slice(-8)} • {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                      <span className="font-sans text-body font-semibold text-accent">
                        ₹{o.totalPrice.toLocaleString()}
                      </span>
                      <Badge variant={o.status === "shipped" || o.status === "delivered" ? "new" : "sale"}>
                        {o.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel: Low Stock / Inventory Status */}
          <div className="bg-white dark:bg-[#1C1C1C] border border-border/40 dark:border-neutral-800 p-space-5 shadow-soft flex flex-col gap-space-4">
            <h3 className="font-display text-h3 uppercase tracking-wider text-neutral-900 dark:text-[#F8F7F5]">
              Inventory Restock Warnings
            </h3>
            
            {lowStockVariants.length === 0 ? (
              <p className="font-sans text-body text-success dark:text-[#7BC08A] py-space-3 italic font-medium">
                ✔ All size and color variants are fully stocked.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                 {lowStockVariants.map((v) => (
                  <div key={v.id} className="flex flex-col sm:flex-row justify-between sm:items-center py-2 border-b border-border/40 dark:border-neutral-800 last:border-0 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="font-sans text-body font-medium text-neutral-900 dark:text-white">
                        {v.product.name}
                      </span>
                      <span className="font-sans text-micro text-muted dark:text-neutral-400">
                        Size: {v.size} • Color: {v.color} • SKU: {v.sku}
                      </span>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                      <span className="font-sans text-body font-bold text-error">
                        {v.quantity} units
                      </span>
                      <Badge variant="soldOut">LOW STOCK</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </Container>
  );
}
