import { useForm } from "react-hook-form";
import type { ExpenseInput } from "../types/Expense";

type FormProps = {
  onSubmit : (data: ExpenseInput) => void
}

type FormData = ExpenseInput;

function Form({onSubmit} : FormProps) {
  const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<FormData>();

  return(
  <div>
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Date:
        <input type="date" {...register("date", { required: true })} />
        {errors.date && <span>Date field is required</span>}
      </label>
      <br />
      <label>
        Payer:
        <select {...register("payer", { required: true })} defaultValue="">
          <option value="" disabled>
            -- Choisir un payeur --
          </option>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
        {errors.payer && <span>Payer field is required</span>}
      </label>
      <br />
      <label>
        Description:
        <input
          type="text"
          {...register("description", { required: true })}
          placeholder="Enter description"
        />
        {errors.description && <span>Description field is required</span>}
      </label>
      <br />
      <label>
        Amount:
        <input
          type="number"
          {...register("amount", {
            required: true,
            valueAsNumber: true,
            min: 1,
          })}
          placeholder="Enter amount"
        />
        {errors.amount && <span>Please put a valid amount</span>}
      </label>
      <br />
      <button type="submit">Submit and add the expense</button>
    </form>
  </div>)
}

export default Form;
