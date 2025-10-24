import { useContext } from "react"
import { PageContext } from "../App"

export default function Add() {
    const {setCurrentPage} = useContext(PageContext)
    return (
        <>
            <div>Add</div>
            <button onClick={() => setCurrentPage("Welcome")}>Back</button>
        </>
    )
}