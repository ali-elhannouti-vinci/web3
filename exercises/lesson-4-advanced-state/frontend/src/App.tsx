import { createBrowserRouter, RouterProvider } from "react-router";
import Layout, { loader as layoutLoader } from "./pages/Layout/index";
import Welcome from "./pages/Welcome";
// import Transactions, { loader as transactionsLoader } from './pages/Transactions';
// import ExpenseDetail, { loader as expenseDetailLoader } from './pages/ExpenseDetails';
// import NewTransfer, { loader as NewTransferLoader } from './pages/NewTransfer';

const router = createBrowserRouter([
  {
    Component: Layout,
    loader: layoutLoader,
    id: "layout",

    children: [
      { index: true, Component: Welcome },
      // {
      //   path: 'transactions',
      //   Component: Transactions,
      //   loader: transactionsLoader,
      // },
      // {
      //   path: 'expenses/:id',
      //   Component: ExpenseDetail,
      //   loader: expenseDetailLoader,
      // },
      // {
      //   path: 'transfers/new',
      //   Component: NewTransfer,
      //   loader: NewTransferLoader,
      // }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
