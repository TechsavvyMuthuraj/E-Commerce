'use client';
import { motion } from 'framer-motion';

interface StaggeredTitleProps {
    title: string | string[];
    className?: string;
    delayOffset?: number;
}

export default function StaggeredTitle({ title, className, delayOffset = 0 }: StaggeredTitleProps) {
    const lines = Array.isArray(title) ? title : title.split('\n');

    return (
        <div className={className}>
            {lines.map((line, i) => (
                <div key={i} style={{ overflow: 'hidden', display: 'flex' }}>
                    <motion.div
                        initial={{ y: '110%', opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: delayOffset + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: '-50px' }}
                        dangerouslySetInnerHTML={{ __html: line }}
                    />
                </div>
            ))}
        </div>
    );
}
