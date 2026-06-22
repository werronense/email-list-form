import { readSheet } from "read-excel-file/browser";
import { validateEmail } from "@/utils/emails.ts";
import { type UploadedEmails } from "@/types/email";

type ExtractEmailsInput = {
  spreadsheet: File;
  column: string;
  row: number;
};

export const excelColumnToIndex = (column: string): number => {
  const index = column
    .trim()
    .toUpperCase()
    .split("")
    .reduce((acc, char) => acc * 26 + (char.charCodeAt(0) - 64), 0);

  // offset by one to zero-index
  return index - 1;
};

export const rowsToEmails = (colIndex: number) => {
  const seenEmails = new Set<string>();

  return (emails: UploadedEmails, row: unknown[]) => {
    const cellValue = row[colIndex];

    if (typeof cellValue !== "string") {
      return emails;
    }

    const isValidEmail = validateEmail(cellValue);

    if (seenEmails.has(cellValue)) {
      if (isValidEmail) {
        emails.duplicates.push(cellValue);
      }
      return emails;
    }

    seenEmails.add(cellValue);

    if (isValidEmail) {
      emails.valid.push(cellValue);
    } else {
      emails.invalid.push(cellValue);
    }

    return emails;
  };
};

export const extractEmails = async (
  data: ExtractEmailsInput,
): Promise<UploadedEmails> => {
  const { spreadsheet, column, row } = data;

  // offset by 1 to zero-index, minumum index is 0
  const rowIndex = Math.max(0, row - 1);
  const colIndex = excelColumnToIndex(column);
  const rows = (await readSheet(spreadsheet))?.slice(rowIndex);

  const emails: UploadedEmails = {
    valid: [],
    duplicates: [],
    invalid: [],
  };

  return rows.reduce(rowsToEmails(colIndex), emails);
};
