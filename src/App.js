import { ApolloProvider } from '@apollo/client';

import client from 'graphql/graphqlRequestClient';
import AppRoutes from 'routes/Router';

import './assets/styles/utility.less';

function App() {
  return (
    <ApolloProvider client={client}>
      <AppRoutes />
    </ApolloProvider>
  );
}

export default App;
