import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { initAuth } from '@/api/initAuth';

const queryClient = new QueryClient();
const root = createRoot(document.getElementById('root')!);

(async () => {
  try {
    await initAuth(); //reissue
  } finally {
    root.render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster
            position='top-center'
            toastOptions={{
              duration: 2000,
              success: { duration: 2000 },
              error: { duration: 2000 },
            }}
          />
        </QueryClientProvider>
      </BrowserRouter>,
    );
  }
})();
