import { GraphQLClient } from 'graphql-request';

const requestHeaders = {
  authorization: 'Bearer TokenABC',
};

const requestClient = new GraphQLClient(process.env.REACT_APP_SERVER_URL, {
  headers: requestHeaders,
});

export default requestClient;
