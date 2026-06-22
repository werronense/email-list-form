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
  test.each([
    ["A", 0],
    ["a", 0],
    ["Z", 25],
    ["AA", 26],
    ["AB", 27],
    ["BB", 53],
    ["ZZ", 701],
    ["AAA", 702],
  ])("converts %s to index %i", (column, expected) => {
    expect(excelColumnToIndex(column)).toBe(expected);
  });

  test("handles empty string", () => {
    expect(excelColumnToIndex("")).toBe(-1);
  });

  test("handles non-alphabetic characters", () => {
    expect(excelColumnToIndex("1")).toBe(-16);
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

    expect(emails).toEqual({
      valid: ["test1@example.com", "test2@example.com"],
      duplicates: [],
      invalid: [],
    });
  });

  test("handles empty cells correctly", async () => {
    mockReadSheet.mockResolvedValueOnce([
      ["Header1", "Header2", "Header3"],
      ["data1", "", "other1"],
      ["data2", "test3@example.com", "other2"],
    ]);

    const data = { spreadsheet, column: "B", row: 2 };
    const emails = await extractEmails(data);

    expect(emails).toEqual({
      valid: ["test3@example.com"],
      duplicates: [],
      invalid: [""],
    });
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

    expect(emails).toEqual({
      valid: ["email2@example.com", "email3@example.com"],
      duplicates: [],
      invalid: [],
    });
  });

  test("starts from the first row when row = 1", async () => {
    mockReadSheet.mockResolvedValueOnce([
      ["Header1", "Header2", "Header3"],
      ["data1", "test1@example.com", "other1"],
    ]);

    const data = { spreadsheet, column: "B", row: 1 };
    const emails = await extractEmails(data);

    expect(emails).toEqual({
      valid: ["test1@example.com"],
      duplicates: [],
      invalid: ["Header2"],
    });
  });

  test("handles row index <= 0", async () => {
    mockReadSheet.mockResolvedValue([
      ["Header1", "Header2", "Header3"],
      ["data1", "test1@example.com", "other1"],
    ]);

    const dataZero = { spreadsheet, column: "B", row: 0 };
    const emailsZero = await extractEmails(dataZero);
    expect(emailsZero).toEqual({
      valid: ["test1@example.com"],
      duplicates: [],
      invalid: ["Header2"],
    });

    const dataNeg = { spreadsheet, column: "B", row: -1 };
    const emailsNeg = await extractEmails(dataNeg);
    expect(emailsNeg).toEqual({
      valid: ["test1@example.com"],
      duplicates: [],
      invalid: ["Header2"],
    });
  });

  test("handles empty spreadsheet", async () => {
    mockReadSheet.mockResolvedValueOnce([]);

    const data = { spreadsheet, column: "B", row: 1 };
    const emails = await extractEmails(data);

    expect(emails).toEqual({
      valid: [],
      duplicates: [],
      invalid: [],
    });
  });

  test("handles inconsistent row lengths", async () => {
    mockReadSheet.mockResolvedValueOnce([
      ["Header1", "Header2"],
      ["data1", "email1@example.com"],
      ["data2"],
      ["data3", "email3@example.com"],
    ]);

    const data = { spreadsheet, column: "B", row: 2 };
    const emails = await extractEmails(data);

    expect(emails).toEqual({
      valid: ["email1@example.com", "email3@example.com"],
      duplicates: [],
      invalid: [],
    });
  });

  test("handles column index out of bounds", async () => {
    mockReadSheet.mockResolvedValueOnce([
      ["Header1", "Header2", "Header3"],
      ["data1", "test1@example.com", "other1"],
    ]);

    const data = { spreadsheet, column: "Z", row: 2 };
    const emails = await extractEmails(data);

    expect(emails).toEqual({
      valid: [],
      duplicates: [],
      invalid: [],
    });
  });

  test("handles row index out of bounds", async () => {
    mockReadSheet.mockResolvedValueOnce([
      ["Header1", "Header2", "Header3"],
      ["data1", "test1@example.com", "other1"],
    ]);

    const data = { spreadsheet, column: "B", row: 10 };
    const emails = await extractEmails(data);

    expect(emails).toEqual({
      valid: [],
      duplicates: [],
      invalid: [],
    });
  });

  test("correctly handles duplicate emails", async () => {
    mockReadSheet.mockResolvedValueOnce([
      ["Header1", "Header2", "Header3"],
      ["data1", "test1@example.com", "other1"],
      ["data2", "test1@example.com", "other2"],
      ["data3", "test2@example.com", "other3"],
      ["data4", "test1@example.com", "other4"],
    ]);

    const data = { spreadsheet, column: "B", row: 2 };
    const emails = await extractEmails(data);

    expect(emails).toEqual({
      valid: ["test1@example.com", "test2@example.com"],
      duplicates: ["test1@example.com", "test1@example.com"],
      invalid: [],
    });
  });

  test("correctly handles invalid email addresses", async () => {
    mockReadSheet.mockResolvedValueOnce([
      ["Header1", "Header2", "Header3"],
      ["data1", "not-an-email", "other1"],
      ["data2", "test1@example.com", "other2"],
      ["data3", "@example.com", "other3"],
      ["data4", "test2@", "other4"],
    ]);

    const data = { spreadsheet, column: "B", row: 2 };
    const emails = await extractEmails(data);

    expect(emails).toEqual({
      valid: ["test1@example.com"],
      duplicates: [],
      invalid: ["not-an-email", "@example.com", "test2@"],
    });
  });
});
