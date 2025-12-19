import SchemaBuilder from "../../graphql/builder";
import * as expenseRepository from "./expenseRepository";

const augmentSchema = (builder: typeof SchemaBuilder) => {
  const ExpenseRef = builder.prismaObject("Expense", {
    fields: (t) => ({
      id: t.exposeID("id"),
      description: t.exposeString("description"),
      amount: t.exposeFloat("amount"),

      // Conversion Date -> String ISO
      date: t.string({
        resolve: (parent) => parent.date.toISOString(),
      }),

      payer: t.relation("payer"),
      participants: t.relation("participants"),

      // Champ calculé
      isForSelf: t.boolean({
        // 1. L'option SELECT est obligatoire ici
        // Elle dit à Pothos : "Pour ce champ, va chercher la relation participants"
        select: {
          participants: {
            select: { id: true }, // On ne récupère que l'ID pour optimiser
          },
        },
        resolve: (parent) => {
          // Grâce au 'select' ci-dessus, TypeScript sait maintenant que
          // 'parent.participants' existe et contient un tableau d'objets avec 'id'.

          const participants = parent.participants;

          // Logique : C'est "pour soi" si :
          // 1. Il n'y a qu'un seul participant
          // 2. L'ID de ce participant est égal à l'ID du payeur (payerId)
          return (
            participants.length === 1 && participants[0].id === parent.payerId
          );
        },
      }),
    }),
  });

  builder.queryField("expense", (t) =>
    t.field({
      type: ExpenseRef,
      args: {
        id: t.arg.int({ required: true }),
      },
      resolve: async (_root, args, _ctx, _info) => {
        return expenseRepository.getExpenseById(args.id as number);
      },
    })
  );

  builder.mutationField("createExpense", (t) =>
    t.field({
      type: ExpenseRef,
      args: {
        description: t.arg.string({ required: true }),
        amount: t.arg.float({ required: true }),
        // Note: Assure-toi d'avoir enregistré le scalar 'Date' dans ton builder
        date: t.arg({ type: "Date", required: true }),
        payerId: t.arg.int({ required: true }),
        participantIds: t.arg({ type: ["Int"], required: true }),
      },
      resolve: async (_parent, args, _context, _info) => {
        const { description, amount, date, payerId, participantIds } = args;
        return expenseRepository.createExpense({
          description,
          amount,
          date,
          payerId,
          participantIds,
        });
      },
    })
  );
};

export default augmentSchema;
