import { ApolloProvider } from '@apollo/client';
import { ConfigProvider } from 'antd';

import theme from 'assets/theme';
import client from 'graphql/graphqlRequestClient';
import AppRoutes from 'routes/Router';

import './assets/styles/utility.less';

function App() {
  return (
    <ApolloProvider client={client}>
      <ConfigProvider theme={theme}>
        <AppRoutes />
      </ConfigProvider>
    </ApolloProvider>
  );
}

export default App;
