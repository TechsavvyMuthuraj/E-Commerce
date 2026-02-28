import Link from 'next/link';
import styles from './layout.module.css';

import DashboardNav from './DashboardNav';
import UserBadge from './UserBadge';
import LogoutButton from './LogoutButton';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`container ${styles.dashboardLayout}`}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h3>User Settings</h3>
                    <UserBadge />
                </div>

                <DashboardNav />

                <div className={styles.sidebarFooter}>
                    <LogoutButton />
                </div>
            </aside>

            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
