import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CompareProduct {
    id: string;
    slug: string;
    title: string;
    price: number;
    image: string;
    features: string[];
}

interface CompareState {
    compareItems: CompareProduct[];
    addToCompare: (product: CompareProduct) => void;
    removeFromCompare: (slug: string) => void;
    clearCompare: () => void;
}

export const useCompareStore = create<CompareState>()(
    persist(
        (set, get) => ({
            compareItems: [],
            addToCompare: (product) => {
                const currentItems = get().compareItems;
                if (currentItems.length >= 3) {
                    alert('You can only compare up to 3 models at a time.');
                    return;
                }
                if (currentItems.find((item) => item.slug === product.slug)) {
                    return; // Already exists
                }
                set({ compareItems: [...currentItems, product] });
            },
            removeFromCompare: (slug) => {
                set({ compareItems: get().compareItems.filter((item) => item.slug !== slug) });
            },
            clearCompare: () => set({ compareItems: [] }),
        }),
        {
            name: 'hardware-compare-storage',
        }
    )
);
