import { describe, expect, test } from "vitest";
import { validateEmail } from "@/utils/emails";

describe("isValidEmail", () => {
  const validEmails = [
    "test@example.com",
    "user.name@domain.co.uk",
    "firstname.lastname@company.org",
    "email+7@example.com",
  ];

  test.each(validEmails)(
    "returns true for valid email address: %s",
    (email) => {
      expect(validateEmail(email)).toBe(true);
    },
  );

  const invalidEmails = [
    "plainaddress",
    "#@%^%#$@#$@#.com",
    "@example.com",
    "Joe Smith <email@example.com>",
    "email.example.com",
    "email..email@example.com",
    "email@example",
    "email@.com",
    "@email.com",
    "email@example..com",
    "",
    " ",
  ];

  test.each(invalidEmails)(
    "returns false for invalid email address: %s",
    (email) => {
      expect(validateEmail(email)).toBe(false);
    },
  );
});
