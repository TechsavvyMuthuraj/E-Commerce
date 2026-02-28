'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './BeforeAfterSlider.module.css';

export default function BeforeAfterSlider() {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
        setSliderPos(percent);
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (e.buttons === 1) handleMove(e.clientX);
    };

    const onClick = (e: React.MouseEvent) => {
        handleMove(e.clientX);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h3 className={styles.title}>Visual Evidence</h3>
                <p className={styles.subtitle}>Drag the slider to compare system telemetry before and after EXE TOOL optimization.</p>
            </div>

            <div
                className={styles.container}
                ref={containerRef}
                onPointerMove={onPointerMove}
                onClick={onClick}
                style={{ touchAction: 'none' }}
            >
                {/* ── BEFORE (Background Layer) ── */}
                <div className={`${styles.layer} ${styles.beforeLayer}`}>
                    <div className={styles.panelContent}>
                        <div className={styles.badge} style={{ color: '#ff5f56', borderColor: '#ff5f56' }}>STATUS: BLOATED</div>
                        <div className={styles.metricsGrid}>
                            <div className={styles.metricCard}>
                                <span className={styles.metricLabel}>Boot Time</span>
                                <span className={styles.metricValue} style={{ color: '#ff5f56' }}>84.5s</span>
                            </div>
                            <div className={styles.metricCard}>
                                <span className={styles.metricLabel}>Idle RAM Usage</span>
                                <span className={styles.metricValue} style={{ color: '#ff5f56' }}>4.2 GB</span>
                            </div>
                            <div className={styles.metricCard}>
                                <span className={styles.metricLabel}>Avg. Game FPS</span>
                                <span className={styles.metricValue} style={{ color: '#ffaa00' }}>68 FPS</span>
                            </div>
                            <div className={styles.metricCard}>
                                <span className={styles.metricLabel}>Input Latency</span>
                                <span className={styles.metricValue} style={{ color: '#ff5f56' }}>14.2 ms</span>
                            </div>
                        </div>
                        <div className={styles.processList}>
                            <code>&gt; 92 active background telemetry processes</code>
                            <code style={{ color: '#ffaa00' }}>&gt; DWM.exe network spikes detected</code>
                            <code style={{ color: '#ff5f56' }}>&gt; WARNING: System resources heavily throttled</code>
                        </div>
                    </div>
                </div>

                {/* ── AFTER (Foreground Masked Layer) ── */}
                <div
                    className={`${styles.layer} ${styles.afterLayer}`}
                    style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                >
                    <div className={styles.panelContent}>
                        <div className={styles.badge} style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}>STATUS: OPTIMIZED</div>
                        <div className={styles.metricsGrid}>
                            <div className={styles.metricCard}>
                                <span className={styles.metricLabel}>Boot Time</span>
                                <span className={styles.metricValue} style={{ color: 'var(--accent)' }}>18.2s</span>
                            </div>
                            <div className={styles.metricCard}>
                                <span className={styles.metricLabel}>Idle RAM Usage</span>
                                <span className={styles.metricValue} style={{ color: 'var(--accent)' }}>1.8 GB</span>
                            </div>
                            <div className={styles.metricCard}>
                                <span className={styles.metricLabel}>Avg. Game FPS</span>
                                <span className={styles.metricValue} style={{ color: 'var(--accent)' }}>144 FPS</span>
                            </div>
                            <div className={styles.metricCard}>
                                <span className={styles.metricLabel}>Input Latency</span>
                                <span className={styles.metricValue} style={{ color: 'var(--accent)' }}>2.1 ms</span>
                            </div>
                        </div>
                        <div className={styles.processList}>
                            <code>&gt; 0 active tracking processes</code>
                            <code style={{ color: 'var(--accent)' }}>&gt; Network stack optimized for UDP priority</code>
                            <code style={{ color: 'var(--accent)' }}>&gt; SUCCESS: Hardware unleashed</code>
                        </div>
                    </div>
                </div>

                {/* ── SLIDER HANDLE ── */}
                <div
                    className={styles.handle}
                    style={{ left: `${sliderPos}%` }}
                >
                    <div className={styles.handleLine}></div>
                    <div className={styles.handleButton}>
                        &#8596;
                    </div>
                </div>

                <div className={styles.dragPrompt} style={{ opacity: sliderPos > 40 && sliderPos < 60 ? 1 : 0 }}>
                    &lt; DRAG TO COMPARE &gt;
                </div>
            </div>
        </div>
    );
}
