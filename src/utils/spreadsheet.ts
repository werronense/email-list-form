import { readSheet } from "read-excel-file/browser";

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

  // offset by one to zero-index
  const rowIndex = row - 1;

  const rows = await readSheet(spreadsheet);

  return rows.slice(rowIndex).flatMap((row) => String(row[colIndex] ?? ""));
};
