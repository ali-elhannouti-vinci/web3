import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import * as expenseRepository from "@/api/expense/expenseRepository";

const typeDefs = `#graphql
     type User {
        id: ID!
        name: String!
        email: String!
        bankAccount: String
}

type Expense {
  id: ID!
  description: String!
  amount: Float!
  date: String!
  payer: User!
  participants: [User!]!
}

type Query {
  expense(id: Int!): Expense
}
   
    type Mutation {
   createExpense(
     description: String!,
     amount: Float!,
     date: String!,
     payerId: Int!,
     participantIds: [Int!]!
   ): Expense!
}


`;

const resolvers = {
  Query: {
    expense: async (_parent: any, args: any, _context: any) =>
      expenseRepository.getExpenseById(args.id),
  },
  Mutation: {
    createExpense: async (_parent: any, args: any, _context: any) => {
      const { description, amount, date, payerId, participantIds } = args;
      const parsedDate = new Date(date);
      return expenseRepository.createExpense({
        description,
        amount,
        date: parsedDate,
        payerId,
        participantIds,
      });
    },
  },
};
const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

const graphqlMiddleware = expressMiddleware(server);

export default graphqlMiddleware;
