/* eslint-disable */
import { GraphQLClient } from 'graphql-request';

const requestClient = new GraphQLClient(process.env.REACT_APP_SERVER_URL);

const useFetchData = <TDocument, TVariables>(
  query: string,
): ((variables?: TVariables) => Promise<TDocument>) => {
  return async (variables?: TVariables) => {
    // const { accessToken } = await getAuthInfo({ retry: true });

    return requestClient.request<TDocument, any>(query, variables, {
      Authorization: `Bearer ${'accessToken'}`,
    });
  };
};

export default useFetchData;
