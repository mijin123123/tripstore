'use client';

import { AuthProvider } from "@/lib/auth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </AuthProvider>
    </>
  );
}
