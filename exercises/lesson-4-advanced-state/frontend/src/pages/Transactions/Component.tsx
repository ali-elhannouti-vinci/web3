import { useLoaderData } from 'react-router';
import ExpenseTransactionItem from '@/components/ExpenseTransactionItem';
import TransferTransactionItem from '@/components/TransferTransactionItem';
import type { LoaderData } from './loader';
import type { Transaction } from '@/types/Transaction';

export default function Transactions() {
  const { transactions } = useLoaderData<LoaderData>();
  return (
    <section>
      <ul>
        {transactions.map((tx : Transaction) => (
          <li key={`${tx.id}`} >
              {tx.kind === 'expense' ? (
                <ExpenseTransactionItem {...tx} />
              ) : (
                <TransferTransactionItem {...tx} />
              )}
          </li>
        ))}
      </ul>
    </section>
  );
}