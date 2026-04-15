/**
 * /dashboard — seller control panel.
 * Protected: redirects buyers and unauthenticated users to /vender.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuthFlow } from "@/contexts/AuthFlowContext";
import ProductsList from "./ProductsList";
import BankDetailsForm from "./BankDetailsForm";
import { LayoutGrid, Landmark } from "lucide-react";
import type { Shop } from "@/types";

type Tab = "productos" | "cobro";

export default function DashboardPage() {
  const router = useRouter();
  const { user, firestoreUser, loading } = useAuthFlow();
  const [tab, setTab] = useState<Tab>("productos");
  const [shopData, setShopData] = useState<Shop | null>(null);
  const [shopLoading, setShopLoading] = useState(true);

  // Auth guard
  useEffect(() => {
    if (loading) return;
    if (!user || firestoreUser?.role !== "seller") {
      router.replace("/vender");
    }
  }, [user, firestoreUser, loading, router]);

  // Fetch shop doc for bank details pre-population
  useEffect(() => {
    if (!user || !db) return;
    const shopId = `shop_${user.uid}`;
    getDoc(doc(db, "shops", shopId)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setShopData({
          id: snap.id,
          ownerId: d.ownerId as string,
          shopName: d.shopName as string,
          bio: (d.bio as string) ?? "",
          rating: (d.rating as number) ?? 0,
          createdAt: d.createdAt?.toDate?.() ?? new Date(),
          bankName: d.bankName as string | undefined,
          accountType: d.accountType as Shop["accountType"],
          accountNumber: d.accountNumber as string | undefined,
          accountHolderName: d.accountHolderName as string | undefined,
          cedula: d.cedula as string | undefined,
          shippingFee: d.shippingFee as number | undefined,
        });
      }
      setShopLoading(false);
    });
  }, [user]);

  // Loading / redirect state
  if (loading || !user || firestoreUser?.role !== "seller") {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-cream py-24">
          <div className="h-8 w-8 rounded-full border-2 border-terracotta border-t-transparent animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  const shopId = `shop_${user.uid}`;
  const shopName = firestoreUser ? (shopData?.shopName ?? "") : "";

  const TABS: { id: Tab; label: string; Icon: typeof LayoutGrid }[] = [
    { id: "productos", label: "Mis Productos", Icon: LayoutGrid },
    { id: "cobro", label: "Datos de cobro", Icon: Landmark },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-cream">
        {/* Header */}
        <div className="border-b border-sand bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-forest">
              Mi Panel
            </h1>
            <p className="text-muted-foreground mt-1">
              {shopData?.shopName ?? "Tu tienda"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-sand bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex gap-1">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    tab === id
                      ? "border-terracotta text-terracotta"
                      : "border-transparent text-muted-foreground hover:text-forest"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {tab === "productos" && (
            <ProductsList shopId={shopId} shopName={shopName} />
          )}

          {tab === "cobro" && (
            shopLoading ? (
              <div className="h-8 w-8 rounded-full border-2 border-terracotta border-t-transparent animate-spin" />
            ) : (
              <BankDetailsForm
                shopId={shopId}
                initial={{
                  bankName: shopData?.bankName,
                  accountType: shopData?.accountType,
                  accountNumber: shopData?.accountNumber,
                  accountHolderName: shopData?.accountHolderName,
                  cedula: shopData?.cedula,
                  shippingFee: shopData?.shippingFee,
                }}
              />
            )
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
