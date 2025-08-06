import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import { BrowserRouter } from 'react-router-dom';
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
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode >,
)
