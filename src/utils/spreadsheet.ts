import { readSheet } from "read-excel-file/browser";

type ExtractEmailsInput = {
  spreadsheet: File;
  column: string;
};

export const excelColumnToIndex = (column: string): number => {
  const index = column
    .trim()
    .toLocaleUpperCase()
    .split("")
    .reduce((acc, char) => acc * 26 + (char.charCodeAt(0) - 64), 0);

  // offset by one to zero-index
  return index - 1;
};

export const extractEmails = async (
  data: ExtractEmailsInput,
): Promise<string[]> => {
  const { spreadsheet, column } = data;

  const colIndex = excelColumnToIndex(column);

  const rows = await readSheet(spreadsheet);

  return rows.flatMap((row) => String(row[colIndex] ?? ""));
};
