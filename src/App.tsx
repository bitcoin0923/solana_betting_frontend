/* eslint-disable */
import { ContractProvider } from './contexts/contract_context';
import { ThemeProvider } from './contexts/theme_context';
import WalletConnectionProvider from './contexts/wallet_connection';
import AppRouter from './pages/app_router';
import { EnvironmentProvider, getInitialProps } from './providers/EnvironmentProvider';
import { UTCNowProvider } from './providers/UTCNowProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export const DEBUG = false

const App = () => (
  <EnvironmentProvider defaultCluster='devnet'>
    <UTCNowProvider>
      <ThemeProvider>
        <WalletConnectionProvider>
          <ContractProvider>
            <QueryClientProvider client={queryClient}>
              <>
              <AppRouter />
              {DEBUG && <ReactQueryDevtools initialIsOpen={false} />}
              </>
            </QueryClientProvider>
          </ContractProvider>
        </WalletConnectionProvider>
      </ThemeProvider>
    </UTCNowProvider>
  </EnvironmentProvider>
);

export default App;
