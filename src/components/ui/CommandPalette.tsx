'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const actions = [
        { id: 'dash', label: 'Dashboard', icon: '📊', route: '/admin' },
        { id: 'create_blog', label: 'Write New Blog Post', icon: '✍️', route: '/admin/blogs' },
        { id: 'coupons', label: 'Manage Promo Codes', icon: '🎟️', route: '/admin/coupons' },
        { id: 'pay_links', label: 'Generate Payment Link', icon: '🔗', route: '/admin/pay-links' },
        { id: 'site', label: 'View Public Site', icon: '🌐', route: '/' },
    ];

    const filteredActions = query === ''
        ? actions
        : actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

    // Toggle logic
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(open => !open);
            }
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    // Focus input on open
    useEffect(() => {
        if (open) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    // Keyboard navigation
    useEffect(() => {
        if (!open) return;
        const nav = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(i => Math.min(i + 1, filteredActions.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(i => Math.max(i - 1, 0));
            } else if (e.key === 'Enter' && filteredActions[selectedIndex]) {
                e.preventDefault();
                handleSelect(filteredActions[selectedIndex].route);
            }
        };
        document.addEventListener('keydown', nav);
        return () => document.removeEventListener('keydown', nav);
    }, [open, selectedIndex, filteredActions]);

    const handleSelect = (route: string) => {
        setOpen(false);
        router.push(route);
    };

    if (!open) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh',
            background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(10px)',
            animation: 'fadeIn 0.2s ease-out'
        }} onClick={() => setOpen(false)}>

            <div style={{
                width: '100%', maxWidth: '600px',
                background: 'rgba(12, 12, 14, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.05)',
                display: 'flex', flexDirection: 'column'
            }} onClick={e => e.stopPropagation()}>

                {/* Search Input */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <span style={{ color: 'var(--accent)', fontSize: '1.2rem', marginRight: '1rem' }}>⚡</span>
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                        placeholder="Type a command or search..."
                        style={{
                            flex: 1, background: 'transparent', border: 'none', color: '#fff',
                            fontSize: '1.2rem', outline: 'none', fontFamily: 'var(--font-heading)'
                        }}
                    />
                    <kbd style={{ background: '#222', color: '#888', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>ESC</kbd>
                </div>

                {/* Results List */}
                <div style={{ padding: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                    {filteredActions.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                            No commands found matching "{query}"
                        </div>
                    ) : (
                        filteredActions.map((action, i) => (
                            <div
                                key={action.id}
                                onMouseEnter={() => setSelectedIndex(i)}
                                onClick={() => handleSelect(action.route)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '8px',
                                    background: selectedIndex === i ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                    color: selectedIndex === i ? '#fff' : '#888',
                                    transition: 'all 0.1s ease',
                                    borderLeft: selectedIndex === i ? '3px solid var(--accent)' : '3px solid transparent'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem', opacity: selectedIndex === i ? 1 : 0.7 }}>{action.icon}</span>
                                <span style={{ flex: 1, fontWeight: selectedIndex === i ? 600 : 400 }}>{action.label}</span>
                                {selectedIndex === i && (
                                    <span style={{ fontSize: '0.7rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>Jump ↵</span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.98) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
            `}</style>
        </div>
    );
}
