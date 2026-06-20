import { describe, expect, test } from "vitest";
import { excelColumnToIndex } from "@/utils/spreadsheet.ts";

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
