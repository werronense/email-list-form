import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Field, FieldLabel, FieldError } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Upload } from "lucide-react";

const SPREADSHEET_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const formSchema = z.object({
  spreadsheet: z
    .instanceof(File, { error: "Please choose a file to upload." })
    .refine((file) => {
      return SPREADSHEET_TYPES.includes(file.type);
    }, "File must be an Excel spreadsheet."),
  column: z
    .string({ error: "Please enter a column name." })
    .min(1, { error: "Please enter a column name." })
    .regex(/^[a-zA-Z0-9]+$/, { error: "Column name must be alphanumeric." }),
});

const onSubmit = (data: z.infer<typeof formSchema>) => {
  console.log("form submitted");
  console.log(data);
};

export default function SpreadsheetForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      spreadsheet: undefined,
      column: "",
    },
  });

  return (
    <section className={"space-y-4"}>
      <h2 className={"text-xl"}>Spreadsheet Form</h2>
      <form className={"space-y-4"} onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          name={"spreadsheet"}
          control={form.control}
          render={({ field: { onChange, name, ref }, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={"spreadsheet"}>
                Upload Spreadsheet
              </FieldLabel>
              <Input
                ref={ref}
                name={name}
                onChange={(e) => onChange(e.target.files?.[0])}
                id={"spreadsheet"}
                type={"file"}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name={"column"}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={"column"}>Select email column</FieldLabel>
              <Input
                {...field}
                id={"column"}
                type={"text"}
                aria-invalid={fieldState.invalid}
                className={"max-w-24"}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className={"flex justify-end"}>
          <Button
            type={"submit"}
            className={
              !form.formState.isValid ? "opacity-50 cursor-not-allowed" : ""
            }
            aria-disabled={!form.formState.isValid}
          >
            Upload <Upload aria-hidden={true} />
          </Button>
        </div>
      </form>
    </section>
  );
}
