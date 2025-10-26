import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Welcome from './pages/Welcome.tsx';
import Add from './pages/Add.tsx';
import List from './pages/List.tsx';
import Home from './pages/Home.tsx';
import Layout from './pages/Layout.tsx';

const router = createBrowserRouter([
    {
      Component: Layout,
      children: [
        {
          index : true,
          Component: Welcome,
        },
        {
          path: "add",
          Component: Add,
        },
        {
          path: "list",
          Component: List,
        },
        {
          path: "home",
          Component: Home,
        },
      ],
    },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
