import { NavLink, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation()
  const currentPagePath = location.pathname

  const navLinksBaseTwClasses = "flex justify-center items-center shadow shadow-black hover:text-green-200 hover:shadow-gray-800 "
  return (
    <>
      <nav className="grid grid-cols-[1fr_repeat(3,auto)_1fr] gap-7 py-3 bg-green-900 text-white w-full shadow-md shadow-green-600 ">
        <div className="bg-green-900"></div>
        <NavLink
          className={currentPagePath == "/home" ? navLinksBaseTwClasses + 'font-bold' : navLinksBaseTwClasses }
          to={"/home"}
        >
          Home
        </NavLink>

        <NavLink className={currentPagePath === "/add" ? navLinksBaseTwClasses + 'font-bold' : navLinksBaseTwClasses} to={"/add"}>
          Add expense
        </NavLink>

        <NavLink className={currentPagePath === "/list" ? navLinksBaseTwClasses + 'font-bold' : navLinksBaseTwClasses} to={"/list"}>
          Expense list
        </NavLink>
        <div className="bg-green-900"></div>
      </nav>
    </>
  );
}
