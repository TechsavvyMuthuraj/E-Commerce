'use client';
import { useState, useEffect } from 'react';



export default function RevenueChart({ initialData }: { initialData?: { date: string, value: number }[] }) {
    const [data, setData] = useState<{ day: number, value: number, date: string }[]>([]);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        if (initialData && initialData.length > 0) {
            setData(initialData.map((d, i) => ({
                day: i + 1,
                value: d.value,
                date: new Date(d.date).toLocaleDateString([], { month: 'short', day: 'numeric', timeZone: 'UTC' })
            })));
        } else {
            // Fallback (empty zero-chart) if no data
            setData(Array.from({ length: 30 }).map((_, i) => ({
                day: i + 1,
                value: 0,
                date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString([], { month: 'short', day: 'numeric' })
            })));
        }
        setTimeout(() => setAnimated(true), 100);
    }, [initialData]);

    if (data.length === 0) return null;

    const maxVal = Math.max(...data.map(d => d.value)) * 1.1; // 10% headroom
    const minVal = 0;

    // SVG Dimensions
    const width = 800;
    const height = 250;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };

    const getX = (index: number) => padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
    const getY = (val: number) => height - padding.bottom - ((val - minVal) / (maxVal - minVal)) * (height - padding.top - padding.bottom);

    // Create SVG Path for the line
    const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.value)}`).join(' ');

    // Create SVG Path for the filled gradient area
    const areaPath = `${linePath} L ${getX(data.length - 1)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

    const formatCurrency = (val: number) => `₹${val.toLocaleString()}`;

    return (
        <div style={{
            background: '#040405',
            border: '1px solid #1a1a1a',
            borderRadius: '8px',
            padding: '1.5rem',
            fontFamily: 'var(--font-mono)',
            position: 'relative',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <h2 style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'var(--font-heading)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        📈 30-Day Revenue
                    </h2>
                    <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.3rem' }}>Live transaction volume</p>
                </div>
                {hoverIndex !== null && (
                    <div style={{ textAlign: 'right', animation: 'fadeIn 0.2s ease-out' }}>
                        <div style={{ color: '#4CAF50', fontSize: '1.4rem', fontWeight: 600 }}>{formatCurrency(data[hoverIndex].value)}</div>
                        <div style={{ color: '#888', fontSize: '0.75rem', textTransform: 'uppercase' }}>{data[hoverIndex].date}</div>
                    </div>
                )}
            </div>

            <div style={{ position: 'relative', width: '100%', height: '250px' }}>
                <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(76, 175, 80, 0.4)" />
                            <stop offset="100%" stopColor="rgba(76, 175, 80, 0)" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
                        const y = height - padding.bottom - (ratio * (height - padding.top - padding.bottom));
                        return (
                            <g key={ratio}>
                                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#1a1a1a" strokeWidth="1" strokeDasharray="4 4" />
                                <text x={padding.left - 10} y={y + 4} fill="#555" fontSize="10" textAnchor="end" fontFamily="var(--font-mono)">
                                    {formatCurrency(Math.floor(minVal + ratio * (maxVal - minVal)))}
                                </text>
                            </g>
                        );
                    })}

                    {/* Date Labels (X-Axis) */}
                    {[0, Math.floor(data.length / 2), data.length - 1].map(i => (
                        <text key={i} x={getX(i)} y={height - 10} fill="#555" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">
                            {data[i]?.date}
                        </text>
                    ))}

                    {/* Filled Area */}
                    <path
                        d={areaPath}
                        fill="url(#revenueGradient)"
                        style={{
                            opacity: animated ? 1 : 0,
                            transition: 'opacity 1s ease-out',
                            transformOrigin: 'bottom',
                            transform: animated ? 'scaleY(1)' : 'scaleY(0)'
                        }}
                    />

                    {/* Line */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke="#4CAF50"
                        strokeWidth="3"
                        filter="url(#glow)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                            strokeDasharray: 2000,
                            strokeDashoffset: animated ? 0 : 2000,
                            transition: 'stroke-dashoffset 1.5s ease-out'
                        }}
                    />

                    {/* Interactive Hover Areas */}
                    {data.map((d, i) => (
                        <g key={i}
                            onMouseEnter={() => setHoverIndex(i)}
                            onMouseLeave={() => setHoverIndex(null)}
                            style={{ cursor: 'crosshair' }}
                        >
                            {/* Invisible wide rect for easier hovering */}
                            <rect
                                x={getX(i) - ((width - padding.left - padding.right) / data.length) / 2}
                                y={padding.top}
                                width={(width - padding.left - padding.right) / data.length}
                                height={height - padding.top - padding.bottom}
                                fill="transparent"
                            />

                            {/* Highlight Dot */}
                            {hoverIndex === i && (
                                <>
                                    <line x1={getX(i)} y1={padding.top} x2={getX(i)} y2={height - padding.bottom} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                                    <circle cx={getX(i)} cy={getY(d.value)} r="5" fill="#000" stroke="#4CAF50" strokeWidth="2" filter="url(#glow)" />
                                </>
                            )}
                        </g>
                    ))}
                </svg>
            </div>

            <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
