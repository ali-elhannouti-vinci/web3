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
import { useFieldArray, useForm } from "react-hook-form";
import { useCurrentUser } from "../Layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodIssueCode } from "zod/v3";
import ApiClient from "@/lib/api";
import { useEffect, useState } from "react";

const baseExpenseSchema = z.object({
  description: z
    .string()
    .max(200, "Description cannot exceed 200 characters")
    .min(3, "Description must be at least 3 characters long")
    .or(z.literal("")),
  amount: z.coerce.number<number>().gt(0, "Amount must be a positive number"),
  payerId: z.coerce.number<number>().gt(0, "Payer doesnt exist"),
  participantIds: z.array(
    z.object({
      id: z.coerce.number<number>().gt(0, "Participant doesnt exist"),
    })
  ).min(2,"You must have at least 2 participants (payer included)"),
});

export default function NewTransfer() {
  const { users } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  
  

  const finalTransferSchema = baseExpenseSchema.superRefine((data, ctx) => {
    if (!users.find((user) => user.id == data.payerId)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "The payer of the expense does not exist",
        path: ["payer"],
      });
    }
    let isPayerIdInParticipantIds = false;
    for (let index = 0; index < data.participantIds.length; index++) {
      const participantId = data.participantIds[index].id;
      if (!users.find((user) => user.id == participantId)) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: "One of the participants does not exist",
          path: ["participantsIds"],
        });
      }
      if (data.payerId === participantId) {
        isPayerIdInParticipantIds = true;
      }
    }
    if (!isPayerIdInParticipantIds) {
      ctx.addIssue({
          code: ZodIssueCode.custom,
          message: "You have to add the payer to the participants",
          path: ["participantsIds"],
        });
    }
  });

  type FormData = z.infer<typeof finalTransferSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(finalTransferSchema),
    defaultValues: {
      amount: 0,
      payerId: currentUser?.id,
      description: "Description de transfert",
      participantIds:[]
    },
  });

  const {
    fields: selectedParticipantIds,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "participantIds",
    keyName: "rhfId"
  });

  const onSubmit = async ({
    description,
    amount,
    payerId,
    participantIds,
  }: FormData) => {
    const participantIdsOnlyIds = participantIds.map((idObj) => idObj.id);
    const newExpenseForm = {
      description,
      amount,
      date: new Date().toISOString(),
      payerId,
      participantIds: participantIdsOnlyIds,
    };
    
    await ApiClient.createExpense(newExpenseForm);
    toast("Expense has been created.");
    navigate("/transactions");
  };

  const isSubmitDisabled =
    form.formState.isSubmitting || !form.formState.isValid;

  function handleRemoveParticipant(indexParticipantIdToRemove: number) {
    remove(indexParticipantIdToRemove);
  }

  useEffect(() => {
    if (currentUser?.id !== form.getValues('payerId')) {  
      form.setValue('payerId', currentUser?.id as number, { shouldValidate: true });
    }
  }, [currentUser, form]);

  // 1. État local pour le Select d'ajout
  const [participantToAddId, setParticipantToAddId] = useState<string | null>(null);

  // 2. Logique d'ajout du participant (remplace la boucle infinie)
  useEffect(() => {
    if (participantToAddId) {
        // Ajout au tableau RHF
        append({ id: Number(participantToAddId) });
        // Réinitialisation du Select pour qu'il se vide
        setParticipantToAddId(null); 
    }
  }, [participantToAddId, append]);

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
          <h3 className="text-lg font-semibold mb-4">Add New Expense</h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Description de transfert"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="payerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payer</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          value={String(field.value)}
                          defaultValue={String(field.value)}
                          onValueChange={field.onChange}
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
                <FormItem>
                  <FormLabel>Choose participants</FormLabel>
                  <FormControl>
                    <Select value={String(participantToAddId)}
                          defaultValue={String(participantToAddId)}
                          onValueChange={setParticipantToAddId}>
                      <SelectTrigger>
                        {/* Affiche l'élément sélectionné ou un placeholder */}
                        <SelectValue />
                      </SelectTrigger>

                      {/* 2. Le conteneur du contenu du dropdown */}
                      <SelectContent>
                        {users.map((user) => {
                          return (
                            <SelectItem
                              key={user.id}
                              value={String(user.id)}
                              disabled={selectedParticipantIds.some(
                                (participantId) => participantId.id === user.id
                              )}
                            >
                              {user.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
                {selectedParticipantIds.map((participantId, index) => {
                  console.log(participantId.id);
                  
                  return (
                    <div className="flex" key={participantId.id}>
                      <Button
                        type="button"
                        onClick={() => handleRemoveParticipant(index)}
                        variant="destructive"
                      >
                        Retirer
                      </Button>
                      <h2 className="flex-1">
                        
                        {
                          // users.find((user) => Number(user.id) === Number(participantId.id))
                          //   ?.name ?? "Participant introuvable"
                          users.find((user) => user.id === participantId.id)
                            ?.name ?? "Participant introuvable"
                        }
                        
                      </h2>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end" onClick={() => {
                if (isSubmitDisabled) {
                  handleDisabledSubmitClick();
              }}}>
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
