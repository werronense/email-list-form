import { useState } from "react";
import { type UploadedEmails } from "@/types/email";
import UploadScreen from "@/components/UploadScreen.tsx";
import ConfirmationScreen from "@/components/ConfirmationScreen";

export default function SpreadsheetForm() {
  const [emails, setEmails] = useState<UploadedEmails | null>(null);

  return (
    <section className={"space-y-4"}>
      <h2 className={"text-xl"}>Spreadsheet Form</h2>
      {emails ? (
        <ConfirmationScreen emails={emails} setEmails={setEmails} />
      ) : (
        <UploadScreen setEmails={setEmails} />
      )}
    </section>
  );
}
