"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  createLoanApplicationSchema,
  ICreateLoanApplication,
} from "@/components/loan-applications/create-loan-application.schema";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createLoanApplication } from "@/lib/functions/loan-applications.api";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

export function CreateLoanApplicationForm() {
  const { toast } = useToast();

  /* ---------------------------- form setup ---------------------------- */
  const form = useForm<ICreateLoanApplication>({
    resolver: zodResolver(createLoanApplicationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      date_of_birth: undefined as unknown as Date,
      gender: "Male",
      country: "India",
      marital_status: "Single",
      email: "",
      phone: "",
      alt_phone: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      pin_code: "",
      monthly_income: 0,
      source_of_income: "Salaried",
      aadhar_number: "",
      aadhar_file: undefined as unknown as File,
      pan_number: "",
      pan_file: undefined as unknown as File,
    },
  });

  /* ------------------------- submit handler --------------------------- */
  const onSubmit = async (values: ICreateLoanApplication) => {
    try {
      await createLoanApplication(values);
      toast({
        style: { backgroundColor: "#4ade80" },
        title: "Loan application submitted!",
        description: `${values.first_name} ${values.last_name}`,
      });
      form.reset();
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Uh-oh! Something went wrong.",
        description: err instanceof Error ? err.message : String(err),
      });
    }
  };

  /* ------------------------------ UI --------------------------------- */
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ------------------------- BASIC DETAILS ----------------------- */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* DATE OF BIRTH */}
        <FormField
          control={form.control}
          name="date_of_birth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* GENDER */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* COUNTRY & MARITAL STATUS */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marital_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marital Status *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ------------------------- CONTACT ----------------------------- */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone *</FormLabel>
                <FormControl>
                  <Input placeholder="9991112223" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ALT PHONE */}
        <FormField
          control={form.control}
          name="alt_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alternate Phone</FormLabel>
              <FormControl>
                <Input placeholder="Optional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ------------------------- ADDRESS ----------------------------- */}
        <FormField
          control={form.control}
          name="street1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street 2</FormLabel>
              <FormControl>
                <Input placeholder="(optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pin_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PIN Code *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ------------------------- INCOME ------------------------------ */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="monthly_income"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Income (₹) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    placeholder="50000"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="source_of_income"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source of Income *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salaried">Salaried</SelectItem>
                    <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ----------------------- IDENTIFICATION ------------------------- */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Aadhaar */}
          <FormField
            control={form.control}
            name="aadhar_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aadhaar Number *</FormLabel>
                <FormControl>
                  <Input placeholder="12-digit number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aadhar_file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aadhaar Document *</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* PAN */}
          <FormField
            control={form.control}
            name="pan_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PAN Number *</FormLabel>
                <FormControl>
                  <Input placeholder="ABCDE1234F" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pan_file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PAN Document *</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ------------------------- SUBMIT ------------------------------ */}
        <Button type="submit" className="mt-6">
          Submit Application
        </Button>
      </form>
    </Form>
  );
}
