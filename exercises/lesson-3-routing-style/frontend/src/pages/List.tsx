import { useContext } from "react";
import { PageContext } from "../App";

export default function List() {
    const { setCurrentPage } = useContext(PageContext);
    return (
        <>
            <div>List</div>
            <button onClick={() => setCurrentPage("Welcome")}>Back</button>

        </>
    )
}