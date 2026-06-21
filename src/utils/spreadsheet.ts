import { readSheet } from "read-excel-file/browser";
import { isValidEmail } from "@/utils/emails.ts";

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

export const extractEmails = async (
  data: ExtractEmailsInput,
): Promise<string[]> => {
  const { spreadsheet, column, row } = data;

  const colIndex = excelColumnToIndex(column);

  // offset by one to zero-index with zero as minimum
  const rowIndex = Math.max(0, row - 1);

  const rows = await readSheet(spreadsheet);

  return rows.slice(rowIndex).flatMap((row) => {
    const cell = row[colIndex];

    return typeof cell === "string" && isValidEmail(cell) ? cell : "";
  });
};
