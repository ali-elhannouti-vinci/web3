import SchemaBuilder from "../../graphql/builder";
import * as expenseRepository from "../expense/expenseRepository";
import * as userRepository from "./userRepository";

const augmentSchema = (builder: typeof SchemaBuilder) => {
  const userRef = builder.prismaObject("User", {
    fields: (t) => ({
      id: t.exposeID("id"),
      name: t.exposeString("name"),
      email: t.exposeString("email"),
      bankAccount: t.exposeString("bankAccount"),
      paidExpenses: t.relation("paidExpenses"),
      participatedExpenses: t.relation("participatedExpenses"),
    }),
  });

  builder.queryType({
    fields: (t) => ({
      users: t.field({
        type: [userRef],
        resolve: async (_root, args, _ctx, _info) => {
          return userRepository.getAllUsers();
        },
      }),
      user: t.field({
        type: userRef,
        args: {
          id: t.arg.int({ required: true }),
        },
        resolve: async (_root, args, _ctx, _info) => {
          return userRepository.getUserById(args.id as number);
        },
      }),
    }),
  });

  builder.mutationType({
    fields: (t) => ({
      createUser: t.field({
        type: userRef,
        args: {
          name: t.arg.string({ required: true }),
          email: t.arg.string({ required: true }),
          bankAccount: t.arg.string(),
        },
        resolve: async (_parent, args, _context, _info) => {
          const { name, email, bankAccount } = args;
          return userRepository.createUser({
            name,
            email,
            bankAccount,
          });
        },
      }),
    }),
  });
};

export default augmentSchema;
