import type { Expense } from "@/types/Expense";
import type { LoaderFunctionArgs } from "react-router";
import { gql } from "@apollo/client";
import graphqlClient from "@/lib/graphql-client";

const EXPENSE_QUERY = gql`
  query ExpenseDetail($id: ID!) {
    expense(id: $id) {
      id
      description
      amount
      payer {
        name
        bankAccount
      }
      participants {
        name
      }
    }
  }
`;

export interface LoaderData {
  expense: Expense;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { data, error } = await graphqlClient.query<{ expense: Expense }>({
    query: EXPENSE_QUERY,
    variables: { id: params.id },
  });

  if (!data?.expense || error) {
    throw new Error(
      "Error while retrieving expense details from the server: " + error
    );
  }

  return { expense: data.expense };
}