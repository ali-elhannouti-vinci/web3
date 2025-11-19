import {
  NavigationMenu,
  // NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  // NavigationMenuTrigger,
  // navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { NavLink, useLocation } from "react-router-dom";

export default function NavigationMenuDemo() {
  const location = useLocation();
  const currentPagePath = location.pathname;
  const navLinksBaseTwClasses =
    "flex justify-center items-center shadow shadow-black hover:text-gray-400 hover:shadow-gray-800 ";
  return (
    <NavigationMenu className="debug-border w-full flex-1 max-w-none ">
      <NavigationMenuList className="debug-border  ">
        <NavigationMenuItem className="flex-1">
          <NavigationMenuLink asChild >
            <NavLink
              to={"/home"}
              className={
                currentPagePath == "/home"
                  ? navLinksBaseTwClasses + "font-bold"
                  : navLinksBaseTwClasses
              }
            >
              Home
            </NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex-1">
          <NavigationMenuLink asChild>
            <NavLink
              to={"/list"}
              className={
                currentPagePath == "/list"
                  ? navLinksBaseTwClasses + "font-bold"
                  : navLinksBaseTwClasses
              }
            >
              List
            </NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex-1">
          <NavigationMenuLink asChild>
            <NavLink
              to={"/add"}
              className={
                currentPagePath == "/add"
                  ? navLinksBaseTwClasses + "font-bold"
                  : navLinksBaseTwClasses
              }
            >
              Add
            </NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
