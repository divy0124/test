import { ApolloProvider } from '@apollo/client';
import { ConfigProvider } from 'antd';

import theme from 'assets/theme';
import client from 'graphql/graphqlRequestClient';

import './assets/styles/utility.less';

function App() {
  return (
    <ApolloProvider client={client}>
      <ConfigProvider theme={theme}>
        {/* <AppRoutes /> */}
        {Test}
      </ConfigProvider>
    </ApolloProvider>
  );
}

export default App;
