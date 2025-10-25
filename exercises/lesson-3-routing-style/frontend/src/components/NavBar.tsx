import { NavLink, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation()
  const currentPagePath = location.pathname

  const navLinksBasicTwClasses = "flex justify-center items-center shadow "
  return (
    <>
      <nav className="grid grid-cols-[1fr_repeat(3,auto)_1fr] gap-7 py-3 bg-green-900 text-white w-full shadow-blue-900 ">
        <div className="bg-green-900"></div>
        <NavLink
          className={currentPagePath == "/home" ? navLinksBasicTwClasses + 'font-bold' : navLinksBasicTwClasses }
          to={"/home"}
        >
          Home
        </NavLink>

        <NavLink className={currentPagePath === "/add" ? navLinksBasicTwClasses + 'font-bold' : navLinksBasicTwClasses} to={"/add"}>
          Add expense
        </NavLink>

        <NavLink className={currentPagePath === "/list" ? navLinksBasicTwClasses + 'font-bold' : navLinksBasicTwClasses} to={"/list"}>
          Expense list
        </NavLink>
        <div className="bg-green-900"></div>
      </nav>
    </>
  );
}
