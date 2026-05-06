"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";
import { Footer } from "@/components/common/Footer";
import { useRouter, usePathname } from "next/navigation";

/**
 * Main Layout wrapper for all authenticated dashboard pages.
 * Handles sidebar toggling, navigation, and role-based route protection.
 */
export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Guard: Redirect to login if unauthenticated or unauthorized for the current route
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        // Enforce role-based access control
        if (pathname.startsWith('/principal') && user.role !== 'principal') {
          router.push('/teacher');
        }
        if (pathname.startsWith('/teacher') && user.role !== 'teacher') {
          router.push('/principal');
        }
      }
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="transition-all duration-300 md:pl-64 flex flex-col min-h-[calc(100vh-64px)]">
        <div className="p-4 md:p-8 max-w-7xl mx-auto flex-1 w-full">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}
