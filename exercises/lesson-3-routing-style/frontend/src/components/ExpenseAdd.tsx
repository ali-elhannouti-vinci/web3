import type { ExpenseInput } from "../types/Expense";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface ExpenseAddProps {
  addExpense: (expense: ExpenseInput) => void;
}

const expenseSchema = z.object({
  description: z
    .string()
    .max(200, "Description cannot exceed 200 characters")
    .min(3, "Description must be at least 3 characters long")
    .or(z.literal("")),
  payer: z.enum(["Alice", "Bob"], {
    error: "Payer must be either Alice or Bob",
  }),
  amount: z.coerce.number<number>().gt(0, "Amount must be a positive number"),
});

type FormData = z.infer<typeof expenseSchema>;

export default function ExpenseAdd({ addExpense }: ExpenseAddProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(expenseSchema),
  });

  const onSubmit = ({ description, payer, amount }: FormData) => {
    addExpense({
      description,
      payer,
      amount,
      date: new Date().toISOString(),
    });
  };

  const isSubmitDisabled = isSubmitting;

  const addFormFieldsBaseTwClasses = "m-2 p-4 border "; // Votre classe existante

  return (
    // La classe existante sur le formulaire est conservée
    <form
      className="flex flex-col justify-center items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* 1. Description - CLASSE APPLIQUÉE AU DIV */}
      <div className={addFormFieldsBaseTwClasses}>
        <label htmlFor="description">Description : </label>
        <input
          id="description"
          type="text"
          placeholder="Description"
          {...register("description")}
        />
        {errors.description && <span> {errors.description.message}</span>}
      </div>

      {/* 2. Payeur - CLASSE APPLIQUÉE AU DIV */}
      <div className={addFormFieldsBaseTwClasses}>
        <label htmlFor="payer">Payeur : </label>
        <select id="payer" {...register("payer")}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
        {errors.payer && <span>{errors.payer.message}</span>}
      </div>

      {/* 3. Montant - CLASSE APPLIQUÉE AU DIV */}
      <div className={addFormFieldsBaseTwClasses}>
        <label htmlFor="amount">Montant : </label>
        <input
          id="amount"
          type="number"
          placeholder="Enter amount"
          step={0.01}
          {...register("amount")}
        />
        {errors.amount && <span>{errors.amount.message}</span>}
      </div>

      {/* 4. Bouton (Utilisation de la concaténation de classe existante) */}
      <button
        className={addFormFieldsBaseTwClasses + "text-green-400 bg-green-900 hover:bg-green-300"}
        type="submit"
        disabled={isSubmitDisabled}
      >
        {isSubmitting ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
