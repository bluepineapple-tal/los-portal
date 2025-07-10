import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function DisplayField({
  label,
  value,
}: Readonly<{
  label: string;
  value?: string | number | null;
}>) {
  return (
    <FormItem className="flex flex-col gap-1">
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          value={value ?? ""}
          disabled
          placeholder="—"
          className="disabled:opacity-100"
        />
      </FormControl>
    </FormItem>
  );
}
