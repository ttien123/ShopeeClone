import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App.tsx'

import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppProvider } from './contexts/app.context';
import ErrorBoundary from './components/ErrorBoundary';
import 'src/i18n/i18n';
import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 0,
        },
    },
});
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <HelmetProvider>
                <QueryClientProvider client={queryClient}>
                    <AppProvider>
                        <ErrorBoundary>
                            <App />
                        </ErrorBoundary>
                    </AppProvider>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </HelmetProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
