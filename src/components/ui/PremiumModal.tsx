'use client';
import { createContext, useCallback, useContext, useRef, useState, useEffect, ReactNode } from 'react';

/* ─── Types ─────────────────────────────────────────────────── */
type ModalVariant = 'success' | 'danger' | 'warning' | 'info';

interface ModalConfig {
    title: string;
    message?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ModalVariant;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
}

interface ModalContextType {
    confirm: (cfg: ModalConfig) => void;
    alert: (cfg: Pick<ModalConfig, 'title' | 'message' | 'variant'>) => void;
}

/* ─── Context ────────────────────────────────────────────────── */
const ModalContext = createContext<ModalContextType | null>(null);

/* ─── Variant config ─────────────────────────────────────────── */
const VARIANT: Record<ModalVariant, { accent: string; dimAccent: string; icon: string }> = {
    success: { accent: '#4CAF50', dimAccent: 'rgba(76,175,80,0.12)', icon: '✓' },
    danger: { accent: '#ff5f56', dimAccent: 'rgba(255,95,86,0.12)', icon: '⚠' },
    warning: { accent: '#f5a623', dimAccent: 'rgba(245,166,35,0.12)', icon: '⚡' },
    info: { accent: '#4285F4', dimAccent: 'rgba(66,133,244,0.12)', icon: 'ℹ' },
};

/* ─── The actual modal component ─────────────────────────────── */
export function PremiumModal({
    open,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'info',
    onConfirm,
    onCancel,
    onClose,
    hideCancel = false,
}: ModalConfig & { open: boolean; onClose: () => void; hideCancel?: boolean }) {

    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const v = VARIANT[variant];

    useEffect(() => {
        if (open) {
            // Small delay to allow mounting before animation
            requestAnimationFrame(() => setVisible(true));
        } else {
            setVisible(false);
        }
    }, [open]);

    if (!open) return null;

    const handleConfirm = async () => {
        if (onConfirm) {
            setIsLoading(true);
            await onConfirm();
            setIsLoading(false);
        }
        onClose();
    };

    const handleCancel = () => {
        onCancel?.();
        onClose();
    };

    return (
        <div
            onClick={handleCancel}
            style={{
                position: 'fixed', inset: 0, zIndex: 99999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem',
                background: `rgba(0,0,0,${visible ? 0.75 : 0})`,
                backdropFilter: `blur(${visible ? 12 : 0}px)`,
                transition: 'background 0.25s ease, backdrop-filter 0.25s ease',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'linear-gradient(135deg, #0d0d0d 0%, #111111 100%)',
                    border: `1px solid ${v.accent}33`,
                    borderRadius: '12px',
                    maxWidth: '460px',
                    width: '100%',
                    overflow: 'hidden',
                    boxShadow: `0 0 60px ${v.dimAccent}, 0 25px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)`,
                    transform: visible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(20px)',
                    opacity: visible ? 1 : 0,
                    transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.25s ease',
                    position: 'relative',
                }}
            >
                {/* Top accent line */}
                <div style={{ height: '2px', background: `linear-gradient(90deg, transparent, ${v.accent}, transparent)` }} />

                {/* Header */}
                <div style={{
                    padding: '1.5rem 1.5rem 1rem',
                    display: 'flex', alignItems: 'flex-start', gap: '1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}>
                    {/* Icon */}
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: v.dimAccent, border: `1px solid ${v.accent}44`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem', color: v.accent, flexShrink: 0,
                        boxShadow: `0 0 20px ${v.dimAccent}`,
                    }}>
                        {v.icon}
                    </div>

                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            margin: 0, color: '#fff', fontSize: '1.05rem',
                            fontFamily: 'var(--font-heading)', letterSpacing: '0.5px',
                        }}>
                            {title}
                        </h3>
                        {message && (
                            <div style={{
                                marginTop: '0.6rem', color: '#999',
                                fontSize: '0.875rem', lineHeight: 1.6,
                            }}>
                                {message}
                            </div>
                        )}
                    </div>

                    {/* Close X */}
                    <button
                        onClick={handleCancel}
                        style={{
                            background: 'none', border: 'none', color: '#444', cursor: 'pointer',
                            fontSize: '1rem', lineHeight: 1, padding: '2px', flexShrink: 0,
                            transition: 'color 0.15s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#aaa')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#444')}
                    >
                        ✕
                    </button>
                </div>

                {/* Actions */}
                <div style={{
                    padding: '1rem 1.5rem 1.5rem',
                    display: 'flex', gap: '0.75rem', justifyContent: 'flex-end',
                }}>
                    {!hideCancel && (
                        <button
                            onClick={handleCancel}
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#888', padding: '0.6rem 1.2rem',
                                borderRadius: '6px', cursor: 'pointer',
                                fontFamily: 'var(--font-heading)', fontSize: '0.8rem',
                                textTransform: 'uppercase', letterSpacing: '1px',
                                transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#ccc'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#888'; }}
                        >
                            {cancelLabel}
                        </button>
                    )}

                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        style={{
                            background: variant === 'danger' ? 'rgba(255,95,86,0.15)' : v.dimAccent,
                            border: `1px solid ${v.accent}55`,
                            color: v.accent, padding: '0.6rem 1.4rem',
                            borderRadius: '6px', cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontFamily: 'var(--font-heading)', fontSize: '0.8rem',
                            textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700,
                            transition: 'background 0.15s ease, box-shadow 0.15s ease',
                            boxShadow: `0 0 20px ${v.dimAccent}`,
                            opacity: isLoading ? 0.7 : 1,
                        }}
                        onMouseEnter={e => { if (!isLoading) e.currentTarget.style.boxShadow = `0 0 30px ${v.accent}44`; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 20px ${v.dimAccent}`; }}
                    >
                        {isLoading ? '...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Provider ───────────────────────────────────────────────── */
let _setModal: ((cfg: (ModalConfig & { open: boolean; hideCancel?: boolean }) | null) => void) | null = null;

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modal, setModal] = useState<(ModalConfig & { open: boolean; hideCancel?: boolean }) | null>(null);
    _setModal = setModal;

    const close = useCallback(() => setModal(null), []);

    const ctx: ModalContextType = {
        confirm: cfg => setModal({ ...cfg, open: true }),
        alert: cfg => setModal({ ...cfg, open: true, confirmLabel: 'OK', hideCancel: true }),
    };

    return (
        <ModalContext.Provider value={ctx}>
            {children}
            {modal && (
                <PremiumModal
                    {...modal}
                    onClose={close}
                />
            )}
        </ModalContext.Provider>
    );
}

/* ─── Hook ───────────────────────────────────────────────────── */
export function useModal() {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error('useModal must be used within ModalProvider');
    return ctx;
}

/* ─── Static helpers (for non-hook contexts) ─────────────────── */
export const modal = {
    confirm: (cfg: ModalConfig) => _setModal?.({ ...cfg, open: true }),
    alert: (cfg: Pick<ModalConfig, 'title' | 'message' | 'variant'>) =>
        _setModal?.({ ...cfg, open: true, confirmLabel: 'OK', hideCancel: true }),
};
