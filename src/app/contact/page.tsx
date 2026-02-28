'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        product: '',
        message: '',
        honeypot: '', // anti-spam
    });

    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [errorMessage, setErrorMessage] = useState('');
    const [ticketId, setTicketId] = useState('');

    const subjects = [
        'General Inquiry',
        'Technical Support',
        'License Issue',
        'Partnership',
        'Billing',
        'Other'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('LOADING');
        setErrorMessage('');

        // Basic client-side validation
        if (formData.message.length < 20) {
            setStatus('ERROR');
            setErrorMessage('Message must be at least 20 characters long.');
            return;
        }

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Transmission failed.');
            }

            setTicketId(data.ticketId || 'TKT-MOCK');
            setStatus('SUCCESS');
        } catch (error: any) {
            setStatus('ERROR');
            setErrorMessage(error.message || 'An unexpected system error occurred.');
        }
    };

    return (
        <div className={styles.page}>
            <div className={`container ${styles.contactContainer}`}>

                {/* Left Column - Contact Info */}
                <div className={styles.leftColumn}>
                    <h1 className={styles.heading}>Direct<br />Transmission</h1>
                    <p className={styles.tagline}>
                        System architects are standing by. Transmit your logs, inquiries, or feedback below.
                    </p>

                    <div className={styles.infoCards}>
                        <div className={styles.infoCard}>
                            <h3>Est. Response Velocity</h3>
                            <p>&lt; 24 Hours (Standard Queue)</p>
                        </div>
                        <div className={styles.infoCard}>
                            <h3>Direct Email Bypass</h3>
                            <p>support@toolcraft.io</p>
                        </div>
                        <div className={styles.infoCard}>
                            <h3>Command Center Hours</h3>
                            <p>0900 - 1800 UTC (Mon-Fri)</p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Application Form */}
                <div className={styles.rightColumn}>
                    {status === 'SUCCESS' ? (
                        <div className={styles.successCard}>
                            <div className={styles.successIcon}>✓</div>
                            <h2>Transmission Received</h2>
                            <p className={styles.tagline} style={{ margin: '1rem auto' }}>
                                Your request has been logged into the ToolCraft matrix.
                                An automated confirmation has been dispatched to <strong>{formData.email}</strong>.
                            </p>

                            <div className={styles.ticketId}>
                                TICKET REF: {ticketId}
                            </div>

                            <button
                                className={styles.newTicketBtn}
                                onClick={() => {
                                    setStatus('IDLE');
                                    setFormData({ ...formData, message: '', subject: 'General Inquiry' });
                                }}
                            >
                                Open New Ticket
                            </button>
                        </div>
                    ) : (
                        <form className={styles.form} onSubmit={handleSubmit}>

                            {/* HONEYPOT (Anti-Spam hidden field) */}
                            <input
                                type="text"
                                name="honeypot"
                                value={formData.honeypot}
                                onChange={handleInputChange}
                                className={styles.honeypot}
                                tabIndex={-1}
                                autoComplete="off"
                            />

                            <div className={styles.inputGroup}>
                                <label htmlFor="name">Operator Designation (Full Name)</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className={styles.input}
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="email">Return Signal Address (Email)</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className={styles.input}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="operator@system.io"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="subject">Transmission Category (Subject)</label>
                                <select
                                    id="subject"
                                    name="subject"
                                    required
                                    className={styles.input}
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                >
                                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="product">Reference Asset (Optional Product)</label>
                                <input
                                    type="text"
                                    id="product"
                                    name="product"
                                    className={styles.input}
                                    value={formData.product}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Nexus Engine Pro"
                                />
                            </div>

                            <div className={styles.inputGroup} style={{ position: 'relative' }}>
                                <label htmlFor="message">Diagnostic Logs (Message Body)</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    minLength={20}
                                    className={styles.input}
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Describe your system event, required support, or inquiry in detail..."
                                    style={{ resize: 'vertical' }}
                                />
                                <span className={styles.charCount}>
                                    {formData.message.length} / Min 20
                                </span>
                            </div>

                            {status === 'ERROR' && (
                                <div className={styles.errorText}>
                                    ⚠️ System Fault: {errorMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                className={`btn-primary ${styles.submitBtn}`}
                                disabled={status === 'LOADING'}
                            >
                                {status === 'LOADING' ? 'Uplinking Data...' : 'Transmit Payload'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
