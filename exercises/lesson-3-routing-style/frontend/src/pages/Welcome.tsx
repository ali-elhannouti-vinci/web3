import { NavLink, Outlet } from "react-router-dom";

export default function Welcome() {
  return (
    <>
      <h1>Welcome to the Expense Tracker</h1>
      <div><NavLink to={'/expenses/add'}>Add an expense</NavLink></div>
      <div><NavLink to={'/expenses/list'}>View all the expenses</NavLink></div>

      <Outlet></Outlet>
    </>
  );
}
