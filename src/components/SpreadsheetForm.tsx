import { type SubmitEvent } from "react";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Upload } from "lucide-react";

const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("form submitted");
};

export default function SpreadsheetForm() {
  return (
    <section className={"space-y-4"}>
      <h2 className={"text-xl"}>Spreadsheet Form</h2>
      <form className={"space-y-4"} onSubmit={handleSubmit}>
        <Field>
          <FieldLabel htmlFor={"spreadsheet"}>Upload Spreadsheet</FieldLabel>
          <Input id={"spreadsheet"} type={"file"} />
        </Field>
        <div className={"flex justify-end"}>
          <Button type={"submit"}>
            Upload <Upload aria-hidden={true} />
          </Button>
        </div>
      </form>
    </section>
  );
}
