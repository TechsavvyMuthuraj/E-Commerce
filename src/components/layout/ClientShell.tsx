'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/layout/Navbar";
import CartDrawer from "@/components/CartDrawer";
import CompareDrawer from "@/components/CompareDrawer";
import CustomCursor from "@/components/layout/CustomCursor";
import ProgressBar from "@/components/layout/ProgressBar";
import DotNav from "@/components/layout/DotNav";
import GlobalBanner from "@/components/layout/GlobalBanner";

export default function ClientShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

    return (
        <>
            <GlobalBanner />
            <div className="global-orb"></div>
            <CustomCursor />
            <ProgressBar />
            {!isAdmin && <DotNav />}
            {!isAdmin && <Navbar />}
            {!isAdmin && <CartDrawer />}
            {!isAdmin && <CompareDrawer />}
            {children}
        </>
    );
}
