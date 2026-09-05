import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWebSocket } from '@/hooks/useWebSocket';

// 1. Создаем QueryClient вне компонента
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// 2. Внутренний компонент, находящийся под провайдером
function AppContent() {
  useWebSocket(); // Теперь useQueryClient внутри хука видит QueryClientProvider!

  return <AppRoutes />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;