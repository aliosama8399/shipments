import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

interface PagePropsWithFlash {
    flash?: {
        success?: string | null;
        error?: string | null;
    };
    [key: string]: unknown;
}

export default function FlashMessage() {
    const { flash } = usePage<PagePropsWithFlash>().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setType('success');
            setVisible(true);
        } else if (flash?.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);
        }
    }, [flash]);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible || !message) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <div
                className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
            >
                <span className="text-lg">{type === 'success' ? '✓' : '✕'}</span>
                <span className="font-medium">{message}</span>
                <button
                    onClick={() => setVisible(false)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                >
                    ×
                </button>
            </div>
        </div>
    );
}
