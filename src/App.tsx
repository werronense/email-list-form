import SpreadsheetForm from "@/components/SpreadsheetForm.tsx";

export default function App() {
  return (
    <div className={"max-w-md mx-auto py-8 space-y-6"}>
      <h1 className={"text-2xl"}>Email List Upload Form</h1>
      <SpreadsheetForm />
    </div>
  );
}
