"use client";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_BASE_URL } from "@/lib/constants";
import { fetchApi } from "@/lib/fetch-api";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  applicationStatusEnum,
  LoanApplicationDTO,
  loanApplicationSchema,
} from "./loan-application.schema";

type Props = {
  app: LoanApplicationDTO;
  onSuccess(updated: LoanApplicationDTO): void;
  onCancel(): void;
};

export function EditLoanApplicationForm({
  app,
  onSuccess,
  onCancel,
}: Readonly<Props>) {
  const form = useForm<Pick<LoanApplicationDTO, "status">>({
    resolver: zodResolver(loanApplicationSchema.pick({ status: true })),
    defaultValues: { status: app.status },
  });

  async function submit(values: { status: LoanApplicationDTO["status"] }) {
    const updated = await fetchApi<LoanApplicationDTO>(
      `${API_BASE_URL}/loan-applications/${app.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      },
    );
    onSuccess(updated);
    form.reset({ status: updated.status });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {applicationStatusEnum.options.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
