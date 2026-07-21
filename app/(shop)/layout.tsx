import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import { PremiumLoader } from "@/components/ui/PremiumLoader";

export interface ShopLayoutProps {
  children: React.ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background dark:bg-background-dark text-primary">
      <PremiumLoader />
      {/* Announcement Horizontal Loop */}
      <AnnouncementBar />

      {/* Auto-Hiding Nav Bar */}
      <Header />

      {/* Main Page Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Structured Footer Directories */}
      <Footer />
    </div>
  );
}
