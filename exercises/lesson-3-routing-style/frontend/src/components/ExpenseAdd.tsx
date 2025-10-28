import type { ExpenseInput } from "../types/Expense";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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
  const form = useForm<FormData>({
    resolver: zodResolver(expenseSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = ({ description, payer, amount }: FormData) => {
   
    addExpense({
      description,
      payer,
      amount,
      date: new Date().toISOString(),
    });
  };

  const isSubmitDisabled = isSubmitting;

  return (
    // La classe existante sur le formulaire est conservée
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center  "
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className={"addExpenseFormField"}>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormDescription>
                Write inside the box what the expense is about
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payer"
          render={({ field }) => (
            <FormItem className={"addExpenseFormField"}>
              <FormLabel>Payer</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                  {...field}
                >
                  <option value="Alice">Alice</option>
                  <option value="Bob">Bob</option>
                </select>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className={"addExpenseFormField"}>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter amount"
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button
        variant="outline"
          type="submit"
          className={
            "addExpenseFormButton"
          }
          disabled={isSubmitDisabled}
        >
          {isSubmitting ? "Adding..." : "Add"}
        </Button>
      </form>
    </Form>
  );
}
