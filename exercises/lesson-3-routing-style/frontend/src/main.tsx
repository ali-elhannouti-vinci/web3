import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Welcome from './pages/Welcome.tsx';
import Add from './pages/Add.tsx';
import List from './pages/List.tsx';

const router = createBrowserRouter([
    {
      path: "/",
      Component: Welcome,
      children: [
        {
          path: "expenses/add",
          Component: Add,
        },
        {
          path: "expenses/list",
          Component: List,
        },
      ],
    },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />,
  </StrictMode>
);
