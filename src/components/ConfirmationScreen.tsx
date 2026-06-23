import { type UploadedEmails } from "@/types/email";
import EmailList from "@/components/EmailList";
import { Button } from "@/components/ui/button";

type ConfirmationScreenProps = {
  emails: UploadedEmails;
  setEmails: (emails: UploadedEmails | null) => void;
};

export default function ConfirmationScreen({
  emails: { valid, invalid, duplicates },
  setEmails,
}: ConfirmationScreenProps) {
  return (
    <>
      <EmailList listTitle={"Valid Email Addresses"} list={valid} />
      <EmailList listTitle={"Invalid Email Addresses"} list={invalid} />
      <EmailList listTitle={"Duplicate Email Addresses"} list={duplicates} />
      <div className={"flex gap-4 justify-end"}>
        <Button variant={"outline"} onClick={() => setEmails(null)}>
          Cancel
        </Button>
        <Button>Approve</Button>
      </div>
    </>
  );
}
