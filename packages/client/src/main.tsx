import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
if (process.env.NODE_ENV === 'production') axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
else axios.defaults.baseURL = '/api'
axios.defaults.validateStatus = () => true;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient({
      defaultOptions: {
        queries: {
          queryFn: async ({ queryKey }: { queryKey: readonly unknown[] }) => {
            const [url, params] = queryKey as [string, Record<string, unknown>]
            return (await axios.get(url, { params })).data
          },
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          refetchOnMount: false,
          retry: 0,
          staleTime: 1000 * 60 * 5
        }
      }
    })}>
      <BrowserRouter>
        <App />
        <Toaster 
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              fontSize: '14px',
              padding: '10px 15px',
              borderRadius: '8px',
              background: '#23272f',
              color: '#fff'
            },
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            }
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode >,
)
