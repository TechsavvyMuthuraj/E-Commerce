'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './layout.module.css';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <button onClick={handleLogout} className={styles.logoutBtn} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-heading)', width: '100%', textAlign: 'left', padding: 0 }}>
            <span className={styles.icon}>←</span> Terminate Session
        </button>
    );
}
