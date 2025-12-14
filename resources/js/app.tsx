import './bootstrap';
import '../css/app.css';
import React, { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import FlashMessage from './Components/FlashMessage';

const appName = import.meta.env.VITE_APP_NAME || 'Shipments';

// Wrapper to include FlashMessage within Inertia context
function AppWrapper({ children }: { children: ReactNode }) {
    return (
        <>
            <FlashMessage />
            {children}
        </>
    );
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        );
        // @ts-ignore - Add default layout
        page.default.layout = page.default.layout || ((page: ReactNode) => <AppWrapper>{page}</AppWrapper>);
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

