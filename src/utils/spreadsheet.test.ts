import { describe, expect, test, vi } from "vitest";
import { readSheet, type SheetData } from "read-excel-file/browser";
import { excelColumnToIndex, extractEmails } from "@/utils/spreadsheet.ts";

vi.mock("read-excel-file/browser", () => ({
  readSheet: vi.fn(),
}));

type ReadSheetTargetOverload = <T, U = number>(
  input: T,
) => Promise<SheetData<U>>;

const mockReadSheet = vi.mocked(readSheet as ReadSheetTargetOverload);

describe("excelColumnToIndex", () => {
  test("excelColumnToIndex converts single-letter column names", () => {
    expect(excelColumnToIndex("A")).toBe(0);
    expect(excelColumnToIndex("a")).toBe(0);
    expect(excelColumnToIndex("Z")).toBe(25);
  });

  test("excelColumnToIndex converts multi-letter column names", () => {
    expect(excelColumnToIndex("AA")).toBe(26);
    expect(excelColumnToIndex("AB")).toBe(27);
    expect(excelColumnToIndex("BB")).toBe(53);
  });
});

describe("extractEmails", () => {
  const spreadsheet = new File([], "test.xlsx");

  test("extracts emails correctly from a given column and row", async () => {
    mockReadSheet.mockResolvedValueOnce([
      ["Header1", "Header2", "Header3"],
      ["data1", "test1@example.com", "other1"],
      ["data2", "test2@example.com", "other2"],
    ]);

    const data = { spreadsheet, column: "B", row: 2 };
    const emails = await extractEmails(data);

    expect(emails).toEqual(["test1@example.com", "test2@example.com"]);
  });

  test("handles empty cells correctly", async () => {
    mockReadSheet.mockResolvedValueOnce([
      ["Header1", "Header2", "Header3"],
      ["data1", "", "other1"],
      ["data2", "test3@example.com", "other2"],
    ]);

    const data = { spreadsheet, column: "B", row: 2 };
    const emails = await extractEmails(data);

    expect(emails).toEqual(["", "test3@example.com"]);
  });

  test("extracts emails from a different starting row", async () => {
    mockReadSheet.mockResolvedValueOnce([
      ["Header1", "Header2", "Header3"],
      ["data1", "email1@example.com", "other1"],
      ["data2", "email2@example.com", "other2"],
      ["data3", "email3@example.com", "other3"],
    ]);

    const data = { spreadsheet, column: "B", row: 3 };
    const emails = await extractEmails(data);

    expect(emails).toEqual(["email2@example.com", "email3@example.com"]);
  });

  test("handles column index out of bounds", async () => {
    mockReadSheet.mockResolvedValueOnce([
      ["Header1", "Header2", "Header3"],
      ["data1", "test1@example.com", "other1"],
    ]);

    const data = { spreadsheet, column: "Z", row: 2 };
    const emails = await extractEmails(data);

    expect(emails).toEqual([""]);
  });

  test("handles row index out of bounds", async () => {
    mockReadSheet.mockResolvedValueOnce([
      ["Header1", "Header2", "Header3"],
      ["data1", "test1@example.com", "other1"],
    ]);

    const data = { spreadsheet, column: "B", row: 10 };
    const emails = await extractEmails(data);

    expect(emails).toEqual([]);
  });
});
