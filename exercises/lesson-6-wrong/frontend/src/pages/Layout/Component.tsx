import { Outlet } from 'react-router';
import { Toaster } from 'sonner';
import NavBar from '@/components/Navbar';

export default function Layout() {
  return (
    <div>
      <NavBar></NavBar>
      <main className="p-6">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
