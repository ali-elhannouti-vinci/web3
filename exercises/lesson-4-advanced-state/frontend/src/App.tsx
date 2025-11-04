import { createBrowserRouter, RouterProvider } from "react-router";
import Layout, { loader as layoutLoader } from "./pages/Layout/index";
import Welcome from "./pages/Welcome";
import Transactions, { loader as transactionsLoader } from './pages/Transactions';
import ExpenseDetail, { loader as expenseDetailLoader } from './pages/ExpenseDetails';
import NewTransfer, { loader as newTransferLoader } from './pages/NewTransfer';
import NewExpense,{loader as newExpenseLoader} from './pages/NewExpense';
import GlobalErrorPage from "./pages/Errors/GlobalErrorPage";

const router = createBrowserRouter([
  {
    Component: Layout,
    loader: layoutLoader,
    id: "layout",
    errorElement: <GlobalErrorPage />,
    children: [
      { index: true, Component: Welcome },
      {
        path: 'transactions',
        Component: Transactions,
        loader: transactionsLoader,
      },
      {
        path: 'expenses/:id',
        Component: ExpenseDetail,
        loader: expenseDetailLoader,
      },
      {
        path: 'expenses/new',
        Component: NewExpense,
        loader: newExpenseLoader,
      },
      {
        path: 'transfers/new',
        Component: NewTransfer,
        loader: newTransferLoader,
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
