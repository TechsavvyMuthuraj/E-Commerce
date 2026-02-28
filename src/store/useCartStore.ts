import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string; // usually product_slug + license_tier
    productId: string;
    slug: string;
    title: string;
    price: number;
    licenseTier: string;
    image: string;
}

interface CartState {
    items: CartItem[];
    isDrawerOpen: boolean;
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    toggleDrawer: () => void;
    openDrawer: () => void;
    closeDrawer: () => void;
    getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isDrawerOpen: false,
            addItem: (item) => {
                set((state) => {
                    // Check if item already exists
                    const exists = state.items.find((i) => i.id === item.id);
                    if (exists) return state; // Prevent duplicates of same license for same product
                    return { items: [...state.items, item] };
                });
            },
            removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
            clearCart: () => set({ items: [] }),
            toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
            openDrawer: () => set({ isDrawerOpen: true }),
            closeDrawer: () => set({ isDrawerOpen: false }),
            getCartTotal: () => {
                return get().items.reduce((total, item) => total + item.price, 0);
            },
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ items: state.items }), // Only persist items, not UI state
        }
    )
);
