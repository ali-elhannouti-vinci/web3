import { createContext, useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Add from "./pages/Add";
import List from "./pages/List";

export const PageContext = createContext<{
  currentPage: string;
  setCurrentPage: (page: string) => void;
}>();

function App() {
  const pages: { [key: string]: React.FunctionComponent } = {
    Welcome: Welcome,
    List: List,
    Add: Add,
  };

  const [currentPage, setCurrentPage] = useState<string>("Welcome");

  const CurrentPageComponent = pages[currentPage];

  function handlePageChange(page: string) {
    window.history.pushState(null, page, `/${page.toLowerCase()}`);
    setCurrentPage(page);
  }

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage: handlePageChange }}>
  <CurrentPageComponent />
</PageContext.Provider>
  );
  return (
    <>
      <Home />
    </>
  );
}

export default App;
