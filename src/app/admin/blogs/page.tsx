import { useState, useEffect, useRef } from 'react';
import styles from '../page.module.css';
import PremiumBlogRenderer from '@/components/ui/PremiumBlogRenderer';

interface BlogDoc {
    _id: string;
    title: string;
    slug?: { current: string };
    category?: string;
    _createdAt: string;
}

interface LinkItem { label: string; url: string; }

const EMPTY_FORM = {
    title: '', slug: '', category: 'Windows Tips', excerpt: '',
    body: '', readTime: '5 min read',
    // social / developer
    authorTwitter: '', authorGithub: '', authorLinkedin: '', authorYoutube: '', authorWebsite: '',
};

const CATEGORIES = [
    'Windows Tips', 'Optimization Guides', 'Privacy & Security',
    'Gaming Performance', 'Product Updates', 'Tutorials', 'Debloat Guides',
];

export default function AdminBlogsPage() {
    const [docs, setDocs] = useState<BlogDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [tab, setTab] = useState<'write' | 'preview'>('write');

    // Cover image
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [coverPreview, setCoverPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    // Inline links
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [linkLabel, setLinkLabel] = useState('');
    const [linkUrl, setLinkUrl] = useState('');

    const f = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(p => ({ ...p, [key]: e.target.value }));

    const loadDocs = () => {
        setLoading(true);
        fetch('/api/admin/sanity?type=post')
            .then(r => r.json())
            .then(d => { setDocs(d.documents || []); setLoading(false); });
    };
    useEffect(() => { loadDocs(); }, []);

    /* ── Image Upload ──────────────────── */
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setMsg('');
        const fd = new FormData();
        fd.append('file', file);
        try {
            const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd });
            const data = await res.json();
            if (data.url) {
                setCoverImageUrl(data.url);
                setCoverPreview(data.url);
                setMsg('✓ Cover image uploaded!');
            } else {
                setMsg('⚠ Upload failed: ' + (data.supabaseNote || data.error || 'Unknown'));
            }
        } catch (err: any) {
            setMsg('⚠ Network error: ' + err.message);
        }
        setUploading(false);
    };

    /* ── Add Link ─────────────────────── */
    const addLink = () => {
        if (!linkLabel.trim() || !linkUrl.trim()) return;
        const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
        setLinks(p => [...p, { label: linkLabel.trim(), url }]);
        // Insert markdown link into body
        const mdLink = `[${linkLabel.trim()}](${url})`;
        setForm(p => ({ ...p, body: p.body + (p.body ? '\n\n' : '') + mdLink }));
        setLinkLabel(''); setLinkUrl('');
    };

    /* ── Save ─────────────────────────── */
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true); setMsg('');
        const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-');
        const doc: any = {
            _type: 'post',
            title: form.title,
            slug: { _type: 'slug', current: slug },
            category: form.category,
            excerpt: form.excerpt,
            body: form.body,
            readTime: form.readTime,
            publishedAt: new Date().toISOString(),
            links: links.map(l => ({ label: l.label, url: l.url })),
            author: {
                name: 'Muthuraj C',
                twitter: form.authorTwitter,
                github: form.authorGithub,
                linkedin: form.authorLinkedin,
                youtube: form.authorYoutube,
                website: form.authorWebsite,
            },
        };
        if (coverImageUrl) {
            doc.coverImageUrl = coverImageUrl;
        }
        const isEdit = !!editId;
        const res = await fetch('/api/admin/sanity', {
            method: isEdit ? 'PATCH' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(isEdit ? { id: editId, patch: doc } : { document: doc })
        });
        const data = await res.json();
        if (data.success) {
            setMsg(`✓ Blog post ${isEdit ? 'updated' : 'published'}!`);
            resetForm();
            loadDocs();
        } else {
            setMsg('Error: ' + JSON.stringify(data.error));
        }
        setSaving(false);
    };

    const resetForm = () => {
        setForm({ ...EMPTY_FORM });
        setEditId(null);
        setCoverImageUrl(''); setCoverPreview('');
        setLinks([]);
        setTab('write');
    };

    const handleEdit = (doc: BlogDoc) => {
        setEditId(doc._id);
        setForm({ ...EMPTY_FORM, title: doc.title || '', slug: doc.slug?.current || '', category: doc.category || 'Windows Tips' });
        setTab('write');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this blog post from Sanity?')) return;
        await fetch('/api/admin/sanity', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        loadDocs();
    };

    /* ── Snippet Injectors ─── */
    const insertSnippet = (snippet: string) => {
        setForm(p => ({ ...p, body: p.body + (p.body && !p.body.endsWith('\n\n') ? '\n\n' : '') + snippet + '\n\n' }));
    };

    const SNIPPETS = {
        title: "[StaggeredTitle]\nYour Premium Title Here\nSecond Line of Title\n[/StaggeredTitle]",
        stepCard: "[StepCard: 01]\nYour Step Title\nYour detailed step description goes here.\n[/StepCard]",
        terminal: "[Terminal]\n> exe_tool scan\n# Analyzing registry...\n> SUCCESS: 15 optimizations applied.\n[/Terminal]"
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Blog Posts</h1>
                <p className={styles.pageSub}>Write and publish PC guides. They appear live at /blog with cover image, links, and your developer profile.</p>
            </div>

            <div className={styles.formCard}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h2 className={styles.formTitle} style={{ margin: 0 }}>{editId ? '✏️ Edit Post' : '✍ New Blog Post'}</h2>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="button" onClick={() => setTab('write')}
                            style={{ padding: '0.4rem 1.2rem', fontSize: '0.8rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', background: tab === 'write' ? 'var(--accent)' : 'transparent', color: tab === 'write' ? '#000' : '#888', border: '1px solid ' + (tab === 'write' ? 'var(--accent)' : '#2a2a2a') }}>
                            ✍ Write
                        </button>
                        <button type="button" onClick={() => setTab('preview')}
                            style={{ padding: '0.4rem 1.2rem', fontSize: '0.8rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', background: tab === 'preview' ? 'var(--accent)' : 'transparent', color: tab === 'preview' ? '#000' : '#888', border: '1px solid ' + (tab === 'preview' ? 'var(--accent)' : '#2a2a2a') }}>
                            👁 Preview
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSave}>
                    <div className={styles.fieldset}>

                        {/* ── Title + Slug ── */}
                        <div className={styles.fieldRow}>
                            <div className={styles.field}>
                                <label>Post Title *</label>
                                <input required value={form.title} onChange={f('title')} placeholder="e.g. How to Speed Up Windows 11 in 10 Steps" />
                            </div>
                            <div className={styles.field}>
                                <label>Slug (auto-generated if empty)</label>
                                <input value={form.slug} onChange={f('slug')} placeholder="how-to-speed-up-windows-11" />
                            </div>
                        </div>

                        {/* ── Category + Read Time ── */}
                        <div className={styles.fieldRow}>
                            <div className={styles.field}>
                                <label>Category</label>
                                <select value={form.category} onChange={f('category')}>
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className={styles.field}>
                                <label>Read Time</label>
                                <input value={form.readTime} onChange={f('readTime')} placeholder="5 min read" />
                            </div>
                        </div>

                        {/* ── Cover Image Upload ── */}
                        <div className={styles.field}>
                            <label>Cover Image</label>
                            <div style={{ border: '2px dashed #2a2a2a', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
                                onClick={() => fileRef.current?.click()}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
                            >
                                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                {coverPreview ? (
                                    <img src={coverPreview} alt="Cover preview" style={{ height: '80px', width: '140px', objectFit: 'cover', border: '1px solid #2a2a2a' }} />
                                ) : (
                                    <div style={{ width: '140px', height: '80px', background: '#111', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontSize: '0.75rem' }}>
                                        No image
                                    </div>
                                )}
                                <div>
                                    <div style={{ color: uploading ? 'var(--accent)' : '#888', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                                        {uploading ? '⏳ Uploading...' : '📷 Click to upload cover image'}
                                    </div>
                                    <div style={{ color: '#444', fontSize: '0.72rem' }}>PNG, JPG, WEBP — shown at top of blog post</div>
                                    {coverImageUrl && <div style={{ color: '#4CAF50', fontSize: '0.72rem', marginTop: '0.3rem' }}>✓ Uploaded: {coverImageUrl.slice(0, 50)}...</div>}
                                </div>
                            </div>
                        </div>

                        {/* ── Excerpt ── */}
                        <div className={styles.field}>
                            <label>Excerpt * <span style={{ color: '#555', fontWeight: 400 }}>(shown on blog listing page)</span></label>
                            <textarea required value={form.excerpt} onChange={f('excerpt')} placeholder="Brief summary shown on the blog index..." style={{ minHeight: '80px' }} />
                        </div>

                        {/* ── Body with Write/Preview tabs ── */}
                        <div className={styles.field}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '0.5rem' }}>
                                <label style={{ margin: 0 }}>Post Body <span style={{ color: '#555', fontWeight: 400 }}>— supports advanced blocks</span></label>
                                {tab === 'write' && (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button type="button" onClick={() => insertSnippet(SNIPPETS.title)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>+ Title</button>
                                        <button type="button" onClick={() => insertSnippet(SNIPPETS.stepCard)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>+ Step Card</button>
                                        <button type="button" onClick={() => insertSnippet(SNIPPETS.terminal)} className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>+ Terminal</button>
                                    </div>
                                )}
                            </div>

                            {tab === 'write' ? (
                                <textarea value={form.body} onChange={f('body')}
                                    placeholder={'## Introduction\n\nWrite your article here...\n\n### Step 1: Open Settings\n\n- Tip one\n- Tip two\n\n[Learn more](https://example.com)'}
                                    style={{ minHeight: '400px', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.6' }} />
                            ) : (
                                <div style={{ minHeight: '400px', background: '#0a0a0c', border: '1px solid #2a2a2a', padding: '2.5rem', overflowY: 'auto' }}>
                                    {coverPreview && <img src={coverPreview} alt="Cover" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', marginBottom: '2.5rem', borderRadius: '4px', border: '1px solid #1e1e1e' }} />}
                                    <div style={{ color: 'var(--accent)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{form.category}</div>
                                    <h1 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>{form.title || 'Your Post Title'}</h1>
                                    {form.excerpt && <p style={{ color: '#666', fontStyle: 'italic', borderLeft: '3px solid var(--accent)', paddingLeft: '1rem', marginBottom: '3rem', fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>{form.excerpt}</p>}

                                    <PremiumBlogRenderer content={form.body} />

                                    {links.length > 0 && (
                                        <div style={{ marginTop: '2rem', borderTop: '1px solid #1e1e1e', paddingTop: '1.5rem' }}>
                                            <div style={{ color: '#555', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>References & Links</div>
                                            {links.map((l, i) => <div key={i} style={{ marginBottom: '0.5rem' }}><a href={l.url} style={{ color: 'var(--accent)', textDecoration: 'underline' }} target="_blank" rel="noopener">{l.label} ↗</a></div>)}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ── Add Links ── */}
                        <div className={styles.field}>
                            <label>Add Reference Links <span style={{ color: '#555', fontWeight: 400 }}>(inserted into body + shown at bottom of post)</span></label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '0.75rem', alignItems: 'end' }}>
                                <div>
                                    <div style={{ color: '#555', fontSize: '0.72rem', marginBottom: '0.3rem' }}>LINK LABEL</div>
                                    <input value={linkLabel} onChange={e => setLinkLabel(e.target.value)} placeholder="e.g. Microsoft Docs" style={{ margin: 0 }} />
                                </div>
                                <div>
                                    <div style={{ color: '#555', fontSize: '0.72rem', marginBottom: '0.3rem' }}>URL</div>
                                    <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://docs.microsoft.com/..." style={{ margin: 0 }} />
                                </div>
                                <button type="button" onClick={addLink} className="btn-secondary" style={{ padding: '0.6rem 1rem', margin: 0, whiteSpace: 'nowrap' }}>+ Add Link</button>
                            </div>
                            {links.length > 0 && (
                                <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {links.map((l, i) => (
                                        <span key={i} style={{ background: '#111', border: '1px solid #2a2a2a', padding: '0.3rem 0.8rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <a href={l.url} target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>{l.label}</a>
                                            <span style={{ cursor: 'pointer', color: '#555' }} onClick={() => setLinks(p => p.filter((_, ii) => ii !== i))}>✕</span>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── Developer Social Links ── */}
                        <div className={styles.field} style={{ background: '#080808', border: '1px solid #1a1a1a', padding: '1.25rem' }}>
                            <label style={{ marginBottom: '1rem', display: 'block' }}>
                                👤 Developer Social Links <span style={{ color: '#555', fontWeight: 400 }}>(shown at bottom of blog post)</span>
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                {[
                                    { key: 'authorTwitter', icon: '𝕏', placeholder: 'https://twitter.com/username' },
                                    { key: 'authorGithub', icon: '⌥', placeholder: 'https://github.com/username' },
                                    { key: 'authorLinkedin', icon: 'in', placeholder: 'https://linkedin.com/in/username' },
                                    { key: 'authorYoutube', icon: '▶', placeholder: 'https://youtube.com/@username' },
                                    { key: 'authorWebsite', icon: '🌐', placeholder: 'https://yourwebsite.com' },
                                ].map(({ key, icon, placeholder }) => (
                                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ width: '28px', height: '28px', background: '#111', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--accent)', flexShrink: 0, fontWeight: 700 }}>{icon}</span>
                                        <input value={(form as any)[key]} onChange={f(key as keyof typeof EMPTY_FORM)} placeholder={placeholder} style={{ margin: 0, fontSize: '0.8rem' }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {msg && <div className={msg.startsWith('✓') ? styles.successMsg : styles.errorMsg}>{msg}</div>}

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className={`btn-primary ${styles.saveBtn}`} disabled={saving} style={{ margin: 0 }}>
                                {saving ? 'Publishing...' : (editId ? '✓ Update Post' : '↑ Publish Post')}
                            </button>
                            {editId && (
                                <button type="button" className="btn-secondary" onClick={resetForm}>Cancel Edit</button>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            {/* Published Posts Table */}
            <div>
                <div className={styles.toolbarRow}>
                    <h2 className={styles.sectionTitle}>Published Posts ({docs.length})</h2>
                    <button className="btn-secondary" onClick={loadDocs} style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>Refresh</button>
                </div>
                {loading ? (
                    <div className={styles.emptyState}>Loading from Sanity...</div>
                ) : docs.length === 0 ? (
                    <div className={styles.emptyState}>No blog posts yet. Write your first guide above.</div>
                ) : (
                    <div className={styles.table}>
                        <div className={`${styles.tableRow} ${styles.tableHead} ${styles.docRow}`}>
                            <span>Title</span><span>Category</span><span>Slug</span><span>Date</span><span>Actions</span>
                        </div>
                        {docs.map(doc => (
                            <div key={doc._id} className={`${styles.tableRow} ${styles.docRow}`}>
                                <span>{doc.title}</span>
                                <span className={styles.muted}>{doc.category}</span>
                                <span className={styles.mono}>{doc.slug?.current}</span>
                                <span className={styles.muted}>{new Date(doc._createdAt).toLocaleDateString()}</span>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    <button className={styles.approveBtn} onClick={() => handleEdit(doc)}>Edit</button>
                                    <a href={`/blog/${doc.slug?.current}`} target="_blank" rel="noopener">
                                        <button type="button" className="btn-secondary" style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}>View ↗</button>
                                    </a>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(doc._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
