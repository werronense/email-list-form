import { z } from "zod";

export const isValidEmail = (email: string): boolean => {
  return z.email().safeParse(email).success;
};
