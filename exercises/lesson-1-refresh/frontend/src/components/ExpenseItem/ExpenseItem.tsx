import type { Expense } from "../../types/Expense";
import "./ExpenseItem.css"

function ExpenseItem({id,date,description,payer,amount} : Expense ){
    return (
        <div className="expense-item-simple">
            <div>Id : {id}</div>
            <div>Date : {date}</div>
            <div>Description : {description}</div>
            <div>Payeur : {payer}</div>
            <div>Montant : {amount}</div>
        </div>
    );
}

export default ExpenseItem