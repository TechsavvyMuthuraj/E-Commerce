'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './layout.module.css';

export default function UserBadge() {
    const [email, setEmail] = useState('operator@system.io');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }: any) => {
            if (session?.user?.email) {
                setEmail(session.user.email);
            }
        });

        // Listen for auth changes dynamically
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            if (session?.user?.email) {
                setEmail(session.user.email);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <span className={styles.userEmail}>{email}</span>
    );
}
