'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/layout/Navbar";
import CartDrawer from "@/components/CartDrawer";
import CompareDrawer from "@/components/CompareDrawer";

export default function ClientShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

    return (
        <>
            {!isAdmin && <Navbar />}
            {!isAdmin && <CartDrawer />}
            {!isAdmin && <CompareDrawer />}
            {children}
        </>
    );
}
