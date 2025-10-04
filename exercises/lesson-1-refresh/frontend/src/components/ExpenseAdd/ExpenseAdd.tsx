import type { ExpenseAddProps } from "../../types/Props";

function ExpenseAdd({handleAdd}:ExpenseAddProps) {
    function onAdd() {
        handleAdd();
    }
  return (
    <>
      <button onClick={onAdd}>Add</button>
    </>
  );
}

export default ExpenseAdd
