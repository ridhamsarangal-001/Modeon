import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/services/db";
import { Container } from "@/components/ui/Container";
import { HeadingH2 } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { BackButton } from "@/components/ui/BackButton";
import { logoutAction } from "@/lib/actions/auth-actions";

export const dynamic = "force-dynamic";

interface OrderLogItem {
  id: string;
  createdAt: Date;
  totalPrice: number;
  status: string;
}

interface AddressItem {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

/**
 * Customer Profile Account Dashboard.
 * Lists custom addresses, active orders logs, and catalog details.
 */
export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser?.email) {
    redirect("/login");
  }

  // Fetch the user's Prisma record by email
  const prismaUser = await db.user.findUnique({
    where: { email: supabaseUser.email },
  });

  const userId = prismaUser?.id ?? "";
  const userEmail = supabaseUser.email;
  const userName = prismaUser?.name || "Valued Customer";
  const userRole = prismaUser?.role || "CUSTOMER";

  let orders: OrderLogItem[] = [];
  let addresses: AddressItem[] = [];
  let wishlistCount = 0;

  try {
    orders = await db.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        totalPrice: true,
        status: true,
      },
    });

    addresses = await db.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" },
    });

    wishlistCount = await db.wishlistItem.count({
      where: { userId },
    });
  } catch (e) {
    console.warn("AccountPage: DB fetch warning during rendering.", e);
  }

  return (
    <div className="bg-background dark:bg-background-dark min-h-screen text-primary dark:text-[#F8F7F5] transition-colors duration-300">

      {/* ── Sticky top bar (mobile) / inline bar (desktop) ── */}
      <div className="sticky top-0 z-10 bg-background/95 dark:bg-[#111111]/95 backdrop-blur-sm border-b border-border/40 dark:border-neutral-800 px-4 py-3 sm:static sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:px-0 sm:py-0">
        <Container>
          <div className="flex items-center justify-between sm:pt-8 sm:pb-2">
            <BackButton desktopLabel="Continue Shopping" mobileLabel="Back" />

            {/* Logout — visible in sticky bar on mobile only */}
            <div className="sm:hidden">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="font-sans text-micro tracking-widest uppercase bg-[#111111] dark:bg-white text-white dark:text-[#111111] px-4 py-2 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-neutral-900 dark:focus:ring-white transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </form>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-6 sm:py-space-8">
        <div className="flex flex-col gap-space-6 max-w-[1000px] mx-auto">

          {/* ── Profile Header ── */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border dark:border-neutral-800 pb-space-5">
            <div className="flex flex-col gap-1">
              <HeadingH2 className="font-display text-h2 uppercase tracking-widest text-neutral-900 dark:text-white">
                My Profile
              </HeadingH2>
              <p className="font-sans text-small text-neutral-700 dark:text-neutral-300">
                Welcome back,{" "}
                <span className="font-medium text-neutral-950 dark:text-white">
                  {userName}
                </span>
              </p>
            </div>

            {/* Desktop: badge + logout side by side */}
            <div className="hidden sm:flex items-center gap-space-3">
              <Badge variant="bestSeller">{userRole.toUpperCase()}</Badge>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="font-sans text-micro tracking-widest uppercase bg-[#111111] dark:bg-white text-white dark:text-[#111111] px-4 py-2 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-neutral-900 dark:focus:ring-white transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </form>
            </div>

            {/* Mobile: role badge below title */}
            <div className="sm:hidden">
              <Badge variant="bestSeller">{userRole.toUpperCase()}</Badge>
            </div>
          </div>

          {/* ── Dashboard Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-6">

            {/* Column 1: Profile Info */}
            <div className="bg-white dark:bg-[#1C1C1C] border border-border/40 dark:border-neutral-800 p-space-5 shadow-soft flex flex-col gap-space-4">
              <h3 className="font-sans text-micro tracking-widest uppercase text-neutral-800 dark:text-neutral-200 font-semibold border-b border-border/30 dark:border-neutral-800/40 pb-2">
                General Information
              </h3>
              <div className="flex flex-col gap-3 font-sans text-small">
                <div className="flex flex-col">
                  <span className="text-neutral-700 dark:text-neutral-300 text-[11px] uppercase tracking-wider">
                    Email Address
                  </span>
                  <span className="text-neutral-950 dark:text-white font-medium mt-0.5 break-all">
                    {userEmail}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-neutral-700 dark:text-neutral-300 text-[11px] uppercase tracking-wider">
                    Wishlisted Items
                  </span>
                  <span className="text-neutral-950 dark:text-white font-medium mt-0.5">
                    {wishlistCount} products
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Saved Addresses */}
            <div className="bg-white dark:bg-[#1C1C1C] border border-border/40 dark:border-neutral-800 p-space-5 shadow-soft flex flex-col gap-space-4 md:col-span-2">
              <h3 className="font-sans text-micro tracking-widest uppercase text-neutral-800 dark:text-neutral-200 font-semibold border-b border-border/30 dark:border-neutral-800/40 pb-2">
                Saved Address Book
              </h3>

              {addresses.length === 0 ? (
                <p className="font-sans text-body text-neutral-700 dark:text-neutral-300 italic py-space-2">
                  No addresses saved to portfolio.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="border border-border/40 dark:border-neutral-800 p-space-3 relative flex flex-col gap-1"
                    >
                      {addr.isDefault && (
                        <span className="absolute top-2 right-2 text-[9px] font-sans font-semibold uppercase tracking-wider bg-accent text-primary px-1.5 py-0.5">
                          Default
                        </span>
                      )}
                      <span className="font-sans text-small font-semibold text-neutral-900 dark:text-white">
                        {addr.name}
                      </span>
                      <span className="font-sans text-small text-neutral-700 dark:text-neutral-300 mt-1">
                        {addr.street}, {addr.city}
                        <br />
                        {addr.state}, {addr.postalCode}
                        <br />
                        {addr.country}
                      </span>
                      <span className="font-sans text-[11px] text-neutral-700 dark:text-neutral-300 mt-2">
                        Ph: {addr.phone}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Order Log Panel ── */}
          <div className="bg-white dark:bg-[#1C1C1C] border border-border/40 dark:border-neutral-800 p-space-5 shadow-soft flex flex-col gap-space-4">
            <h3 className="font-sans text-micro tracking-widest uppercase text-neutral-800 dark:text-neutral-200 font-semibold border-b border-border/30 dark:border-neutral-800/40 pb-2">
              My Order Log
            </h3>

            {orders.length === 0 ? (
              <p className="font-sans text-body text-neutral-700 dark:text-neutral-300 italic py-space-2">
                No orders placed under this account yet.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-border/40 dark:border-neutral-800 last:border-0 gap-2"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-sans text-small font-medium text-neutral-950 dark:text-white">
                        Order #{ord.id.slice(-10).toUpperCase()}
                      </span>
                      <span className="font-sans text-micro text-neutral-700 dark:text-neutral-300">
                        Placed on {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-space-4 shrink-0 mt-1 sm:mt-0">
                      <span className="font-sans text-small font-bold text-accent">
                        ₹{ord.totalPrice.toLocaleString()}
                      </span>
                      <Badge
                        variant={
                          ord.status === "shipped" || ord.status === "delivered"
                            ? "new"
                            : "sale"
                        }
                      >
                        {ord.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Mobile Logout (full-width, bottom of page) ── */}
          <div className="sm:hidden pb-6">
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full font-sans text-small tracking-widest uppercase bg-[#111111] dark:bg-white text-white dark:text-[#111111] py-3.5 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 dark:focus:ring-white transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </form>
          </div>

        </div>
      </Container>
    </div>
  );
}
