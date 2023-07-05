import { QueryClient, QueryClientProvider } from 'react-query';

import AppRoutes from 'routes/Router';

import './assets/styles/utility.less';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 60 sec
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />;
    </QueryClientProvider>
  );
}

export default App;
