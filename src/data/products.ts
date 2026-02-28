// Central Product Catalog — PC Optimization & Windows Tools
// Used across: /products, /category/[slug], /products/[slug] fallback

export interface Product {
    id: string;
    slug: string;
    title: string;
    category: string;
    price: number;
    image: string;
    features: string[];
    shortDescription: string;
    longDescription: string;
    pricingTiers: { name: string; price: number; licenseType: string }[];
    galleryUrls?: string[];
}

export const allProducts: Product[] = [
    {
        id: 'win10-optimizer',
        slug: 'win10-optimizer-pack',
        title: 'Windows 10 Optimizer Pack',
        category: 'Optimization',
        price: 299,
        image: 'linear-gradient(135deg, #0078d4 0%, #002050 100%)',
        features: ['Registry Cleaner', 'Startup Manager', 'RAM Booster', 'Privacy Shield', 'Gaming Mode'],
        shortDescription: 'An industrial-grade Windows 10 optimization suite that eliminates bloat and unleashes native hardware performance.',
        longDescription: 'This pack contains a precision-tuned collection of registry tweaks, service disablers, and telemetry blockers specifically engineered for Windows 10. Includes automated scripts for one-click deployment across enterprise environments.',
        pricingTiers: [
            { name: 'Personal', price: 299, licenseType: 'PER' },
            { name: 'Business (5 PCs)', price: 999, licenseType: 'BUS' },
        ]
    },
    {
        id: 'win11-debloat',
        slug: 'win11-debloat-toolkit',
        title: 'Windows 11 Debloat Toolkit',
        category: 'Debloat',
        price: 349,
        image: 'linear-gradient(135deg, #1b1b2f 0%, #16213e 50%, #0f3460 100%)',
        features: ['Bloatware Remover', 'Telemetry Blocker', 'Cortana Killer', 'TPM Bypass Scripts', 'Context Menu Cleaner'],
        shortDescription: 'Surgically remove pre-installed garbage from Windows 11. Built for power users and privacy-focused professionals.',
        longDescription: 'Remove over 40 pre-installed UWP apps, disable all Microsoft telemetry pipelines, reclaim system tray space, and optionally remove Microsoft Edge and OneDrive. Includes reversible restore points before any operation.',
        pricingTiers: [
            { name: 'Personal', price: 349, licenseType: 'PER' },
            { name: 'Unlimited', price: 1499, licenseType: 'UNL' },
        ]
    },
    {
        id: 'pc-health-scanner',
        slug: 'pc-health-scanner',
        title: 'PC Health Scanner Pro',
        category: 'Diagnostics',
        price: 199,
        image: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        features: ['SMART Disk Health', 'Temp Monitoring', 'Driver Checker', 'Memory Diagnostics', 'Event Log Analyzer'],
        shortDescription: 'Deep hardware diagnostics that predict failures before they cost you your data. Real-time vitals at a glance.',
        longDescription: 'A lightweight system health scanner with real-time CPU, GPU, and disk temperature monitoring, SMART status parsing, and predictive failure alerts. Export detailed hardware reports as PDF.',
        pricingTiers: [
            { name: 'Standard', price: 199, licenseType: 'STD' },
            { name: 'Pro + Reports', price: 499, licenseType: 'PRO' },
        ]
    },
    {
        id: 'gaming-booster-pro',
        slug: 'gaming-booster-pro',
        title: 'Gaming Booster Pro',
        category: 'Optimization',
        price: 449,
        image: 'linear-gradient(135deg, #7b2ff7 0%, #f107a3 100%)',
        features: ['FPS Optimizer', 'Network Latency Tuner', 'GPU Priority Setter', 'DirectX Fixer', 'RAM Defrag on Launch'],
        shortDescription: 'One-click PC gaming optimization. Silence background processes, prioritize your GPU, and eliminate input lag.',
        longDescription: 'Gaming Booster Pro automatically identifies and suspends non-essential processes when a game is launched, sets CPU and GPU process priorities, flushes DNS, and applies network stack tweaks to minimize ping. Compatible with Steam, Epic, and Xbox Game Pass.',
        pricingTiers: [
            { name: 'Personal', price: 449, licenseType: 'PER' },
            { name: 'Family (3 PCs)', price: 999, licenseType: 'FAM' },
        ]
    },
    {
        id: 'privacy-shield',
        slug: 'privacy-shield-toolkit',
        title: 'Privacy Shield Toolkit',
        category: 'Privacy',
        price: 249,
        image: 'linear-gradient(135deg, #1a1a2e 0%, #2d6a4f 100%)',
        features: ['Telemetry Blocker', 'Browser Tracker Cleaner', 'Hosts File Manager', 'VPN Kill Switch', 'Mic & Cam Guard'],
        shortDescription: 'Lock down your Windows PC from surveillance, advertisers, and data harvesters — permanently.',
        longDescription: 'A complete privacy hardening toolkit for Windows 10/11. Blocks over 800 known Microsoft, Adobe, and third-party tracking domains via a system-level hosts file injection. Includes a camera/microphone access manager and a one-click browser history zero-out.',
        pricingTiers: [
            { name: 'Standard', price: 249, licenseType: 'STD' },
            { name: 'Business', price: 799, licenseType: 'BUS' },
        ]
    },
    {
        id: 'driver-updater-pro',
        slug: 'driver-updater-pro',
        title: 'Driver Updater Pro',
        category: 'Drivers',
        price: 399,
        image: 'linear-gradient(135deg, #16213e 0%, #533483 100%)',
        features: ['Auto Driver Scan', 'Offline Backup', 'Rollback Support', 'GPU / Chipset Priority', 'Scheduler'],
        shortDescription: 'Automatically find, backup, and install the correct drivers for your exact hardware — with zero guesswork.',
        longDescription: 'Driver Updater Pro scans your system against a database of 12M+ verified drivers, automatically ranks by criticality, creates a restore point before each update, and allows selective one-click rollback. Supports AMD, NVIDIA, Intel, Realtek, and all major vendors.',
        pricingTiers: [
            { name: 'Annual', price: 399, licenseType: 'ANN' },
            { name: 'Lifetime', price: 999, licenseType: 'LTF' },
        ]
    },
    {
        id: 'startup-manager-elite',
        slug: 'startup-manager-elite',
        title: 'Startup Manager Elite',
        category: 'Optimization',
        price: 149,
        image: 'linear-gradient(135deg, #0a0a0a 0%, #1a3a2a 100%)',
        features: ['Startup Delay Control', 'Service On/Off Toggle', 'Boot Time Logger', 'Impact Score', 'Scheduled Cleaning'],
        shortDescription: 'Take back control of Windows boot. Kill silent startup junk and cut boot time in half.',
        longDescription: 'Startup Manager Elite provides a high-resolution view into every application, service, scheduled task, and shell extension that launches at boot. Rate items by their performance impact and suppress or delay them with granular control. Average user sees 40% boot time reduction.',
        pricingTiers: [
            { name: 'Personal', price: 149, licenseType: 'PER' },
            { name: 'Pro', price: 349, licenseType: 'PRO' },
        ]
    },
    {
        id: 'disk-cleaner-ultra',
        slug: 'disk-cleaner-ultra',
        title: 'Disk Cleaner Ultra',
        category: 'Cleanup',
        price: 179,
        image: 'linear-gradient(135deg, #1a0533 0%, #4a0e8f 100%)',
        features: ['Duplicate Finder', 'Junk Sweeper', 'WinSxS Cleaner', 'Log File Purge', 'Large File Analyzer'],
        shortDescription: 'Reclaim gigabytes of wasted disk space from Windows junk, duplicate files, and broken cache.',
        longDescription: 'Disk Cleaner Ultra deep-scans your drives for Windows Update cache, WinSxS duplicates, orphaned registry entries, shadow copies, and large forgotten files. Safely reclaim 10–50GB on a typical Windows installation.',
        pricingTiers: [
            { name: 'Standard', price: 179, licenseType: 'STD' },
            { name: 'Pro (Unlimited)', price: 449, licenseType: 'PRO' },
        ]
    },
];

export const getProductBySlug = (slug: string): Product | undefined =>
    allProducts.find(p => p.slug === slug);
