'use client';
import StaggeredTitle from '@/components/ui/StaggeredTitle';
import StepCard from '@/components/ui/StepCard';
import TerminalBlock from '@/components/ui/TerminalBlock';
// Since this is a shared UI component, we will inline the core text styles 
// so it looks good in both the admin preview and the public frontend.

export default function PremiumBlogRenderer({ content }: { content: string }) {
    if (!content) return null;

    return (
        <div className="premium-blog-content">
            {content.split('\n\n').map((block, i) => {
                const b = block.trim();

                // 1. STAGGERED TITLE
                // [StaggeredTitle]
                // First Line
                // Second Line
                // [/StaggeredTitle]
                if (b.startsWith('[StaggeredTitle]') && b.endsWith('[/StaggeredTitle]')) {
                    const inner = b.slice(16, -17).trim();
                    const lines = inner.split('\n');
                    return (
                        <div key={i} style={{ margin: '3rem 0 1.5rem' }}>
                            <StaggeredTitle title={lines} className="staggered-heading" />
                        </div>
                    );
                }

                // 2. STEP CARD
                // [StepCard: 01]
                // Title Here
                // Description here on multiples lines if needed
                // [/StepCard]
                if (b.startsWith('[StepCard:') && b.endsWith('[/StepCard]')) {
                    const firstLineEnd = b.indexOf(']');
                    const step = b.slice(10, firstLineEnd).trim();
                    const inner = b.slice(firstLineEnd + 1, -11).trim();
                    const lines = inner.split('\n');
                    const title = lines[0] || '';
                    const desc = lines.slice(1).join(' ') || '';
                    return (
                        <div key={i} style={{ margin: '2.5rem 0' }}>
                            <StepCard step={step} title={title} description={desc} />
                        </div>
                    );
                }

                // 3. TERMINAL BLOCK
                // [Terminal]
                // > command
                // output
                // [/Terminal]
                if (b.startsWith('[Terminal]') && b.endsWith('[/Terminal]')) {
                    const inner = b.slice(10, -11).trim();
                    const lines = inner.split('\n');
                    return (
                        <div key={i} style={{ margin: '2.5rem 0' }}>
                            <TerminalBlock lines={lines} />
                        </div>
                    );
                }

                // 4. YouTube Embeds & Inline Links
                let parsed = b.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, (match, label, url) => {
                    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
                        const vidId = url.includes('v=') ? new URL(url).searchParams.get('v') : url.split('youtu.be/')[1]?.split('?')[0];
                        if (vidId) {
                            return `<div style="margin: 2rem 0"><iframe width="100%" height="400" src="https://www.youtube.com/embed/${vidId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 8px; border: 1px solid #333;"></iframe></div><a href="${url}" target="_blank" rel="noopener noreferrer" style="color:var(--accent);text-decoration:none;border-bottom:1px dotted var(--accent);">${label} ↗</a>`;
                        }
                    }
                    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:var(--accent);text-decoration:none;border-bottom:1px dotted var(--accent);">${label} ↗</a>`;
                });

                // Raw Youtube Link Fallback
                if (parsed.match(/^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+/)) {
                    const url = parsed.trim();
                    const vidId = url.includes('v=') ? new URL(url).searchParams.get('v') : url.split('youtu.be/')[1]?.split('?')[0];
                    if (vidId) {
                        return <div key={i} style={{ margin: '2rem 0' }} dangerouslySetInnerHTML={{ __html: `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${vidId}" frameborder="0" allowfullscreen style="border-radius: 8px; border: 1px solid #333;"></iframe>` }} />;
                    }
                }

                // 5. Standard Markdown Tags
                if (b.startsWith('### ')) return <h3 key={i} style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1.4rem', margin: '2.5rem 0 1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{b.slice(4)}</h3>;
                if (b.startsWith('## ')) return <h2 key={i} style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)', fontSize: '2rem', margin: '3rem 0 1.5rem', textTransform: 'uppercase', letterSpacing: '0.02em', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>{b.slice(3)}</h2>;

                // Unordered lists
                if (b.startsWith('- ') || b.startsWith('* ')) {
                    return (
                        <ul key={i} style={{ color: 'var(--muted)', paddingLeft: '2rem', lineHeight: '2', margin: '1.5rem 0', fontFamily: 'var(--font-body)', fontSize: '1.05rem' }}>
                            {b.split('\n').map((item, j) => (
                                <li key={j} dangerouslySetInnerHTML={{ __html: item.replace(/^[-*]\s/, '').replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, `<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--accent);text-decoration:none;border-bottom:1px dotted var(--accent);">$1 ↗</a>`) }} />
                            ))}
                        </ul>
                    );
                }

                // Default paragraph
                return <p key={i} style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: '1.8', margin: '0 0 1.5rem 0', fontFamily: 'var(--font-body)' }} dangerouslySetInnerHTML={{ __html: parsed }} />;
            })}

            <style jsx global>{`
                .premium-blog-content .staggered-heading {
                    font-family: var(--font-heading);
                    font-size: 2.2rem;
                    color: #fff;
                    letter-spacing: 0.02em;
                    text-transform: uppercase;
                }
            `}</style>
        </div>
    );
}
