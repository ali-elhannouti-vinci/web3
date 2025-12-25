// Example: src/components/Header.tsx or updating existing navbar
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useSocket } from '@/contexts/SocketContext';

export default function Header() {
  const { isConnected } = useSocket();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center flex-wrap">
        <Link to="/" className="text-xl font-bold">
          Expenso
        </Link>

        <div>
          <NavLink to="/transactions" className="mr-4">
            All Transactions
          </NavLink>
          <NavLink to="/expenses/new" className="mr-4">
            New Expense
          </NavLink>
          <NavLink to="/transfers/new" className="mr-4">
            New Transfer
          </NavLink>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            to="/reports"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <FileText className="h-4 w-4" />
            Reports
          </Link>
          <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="text-sm">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
          {isAuthenticated ? (
            <>
              <span className="text-gray-700">Welcome, {user?.email}</span>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/login")}>Login</Button>
          )}
        </nav>
      </div>
    </header>
  );
}
