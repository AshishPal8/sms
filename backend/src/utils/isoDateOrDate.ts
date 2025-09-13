import z from "zod";

export const isoDateOrDate = z.preprocess((val) => {
  if (val === null || val === undefined || val === "") return undefined;
  return val instanceof Date ? val : new Date(String(val));
}, z.date().optional());
