import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

const typeDefs = `#graphql
     type Query { hello: String }
   `;

const resolvers = {
  Query: { hello: () => "Hello GraphQL!" },
};

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

const graphqlMiddleware = expressMiddleware(server);

export default graphqlMiddleware;