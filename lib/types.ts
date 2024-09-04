import { z } from "zod";

export const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(10, "min length is 10"),
    password2: z.string(),
  })
  .refine((data) => data.password === data.password2, {
    message: "pass must match",
    path: ["password2"],
  });

export type Schema = z.infer<typeof schema>;
