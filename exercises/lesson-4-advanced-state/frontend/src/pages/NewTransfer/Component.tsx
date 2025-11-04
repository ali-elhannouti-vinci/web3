import { useLoaderData, useNavigate } from "react-router";
import type { LoaderData } from "./loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useCurrentUser } from "../Layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodIssueCode } from "zod/v3";
import ApiClient from "@/lib/api";
import { useEffect, useState } from "react";

const baseTransferSchema = z.object({
  amount: z.coerce.number<number>().gt(0, "Amount must be a positive number"),
  sourceId: z.coerce.number<number>(),
  targetId: z.coerce.number<number>(),
});

export default function NewTransfer() {
  const { users } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  const [error, setError] = useState<null | Error>(null);

  const finalTransferSchema = baseTransferSchema.superRefine((data, ctx) => {
    if (!users.find((user) => user.id == data.sourceId)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "The source of the transfer does not exist",
        path: ["sourceId"],
      });
    }
    if (!users.find((user) => user.id == data.targetId)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "The target of the transfer does not exist",
        path: ["targetId"],
      });
    }
  });

  type FormData = z.infer<typeof finalTransferSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(finalTransferSchema),
    defaultValues: { amount: 0, sourceId: currentUser?.id },
  });

  const onSubmit = async ({ amount, sourceId, targetId }: FormData) => {
    try {
      const newTransferForm = {
        amount,
        sourceId,
        targetId,
        date: new Date().toISOString(),
      };
      await ApiClient.createTransfer(newTransferForm);
      toast("Transfer has been created.");
      navigate("/transactions");
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      }
    }
  };

  const isSubmitDisabled =
    form.formState.isSubmitting || !form.formState.isValid;

  useEffect(() => {
    if (currentUser?.id !== form.getValues("sourceId")) {
      // Utilisez reset pour réinitialiser le formulaire avec la nouvelle source
      // et maintenir les autres valeurs (comme 'amount').
      form.reset({
        amount: form.getValues("amount"), // Garde le montant actuel
        sourceId: currentUser?.id, // Définit le nouvel ID source
        targetId: form.getValues("targetId"), // Garde la cible actuelle
      });

      // Alternativement, si vous ne voulez changer que la source :
      // form.setValue('sourceId', currentUser?.id as number, { shouldValidate: true });
    }
  }, [currentUser, form]);

  const handleDisabledSubmitClick = () => {
    // 🔑 form.trigger() valide tous les champs et met à jour formState.errors
    form.trigger();

    // Optionnel : faire défiler la page jusqu'à la première erreur
    // const firstError = Object.keys(form.formState.errors)[0];
    // if (firstError) {
    //   // Logique pour faire défiler vers l'élément (nécessite useRef sur le champ)
    // }
  };
  return (
    <div>
      <div>
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
          <div className="bg-red-700 text-background">{error?.message}</div>

          <h3 className="text-lg font-semibold mb-4">Add New Transfer</h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          step={0.01}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sourceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                          value={String(field.value)}
                          defaultValue={String(field.value)}
                        >
                          <SelectTrigger>
                            {/* Affiche l'élément sélectionné ou un placeholder */}
                            <SelectValue
                              placeholder={currentUser?.name ?? ""}
                            />
                          </SelectTrigger>

                          {/* 2. Le conteneur du contenu du dropdown */}
                          <SelectContent>
                            {users.map((user) => {
                              return (
                                <SelectItem
                                  key={user.id}
                                  value={String(user.id)}
                                >
                                  {user.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target</FormLabel>

                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        value={String(field.value)}
                        defaultValue={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            {/* Affiche l'élément sélectionné ou un placeholder */}
                            <SelectValue
                              placeholder={currentUser?.name ?? ""}
                            />
                          </SelectTrigger>
                        </FormControl>
                        {/* 2. Le conteneur du contenu du dropdown */}
                        <SelectContent>
                          {users.map((user) => {
                            return (
                              <SelectItem key={user.id} value={String(user.id)}>
                                {user.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div
                className="flex justify-end"
                onClick={() => {
                  if (isSubmitDisabled) {
                    handleDisabledSubmitClick();
                  }
                }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitDisabled}
                  variant="default"
                >
                  {form.formState.isSubmitting ? "Adding..." : "Add"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
