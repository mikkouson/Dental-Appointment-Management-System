import { z } from "zod";

export const PatientSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email().min(1, {
    message: "Invalid email address.",
  }),
  address: z
    .object({
      id: z.number().optional(),
      address: z.string({
        required_error: "Address is required.",
      }),
      latitude: z.number({
        required_error: "Invalid Address",
      }),
      longitude: z.number({
        required_error: "Invalid Address",
      }),
    })
    .refine((data) => data.address.trim().length > 0, {
      message: "Address must be provided.",
    }),
  sex: z.string().min(1, { message: "Sex is required." }),
  age: z.number().min(1, {
    message: "Age is required.",
  }),
});

export type PatientFormValues = z.infer<typeof PatientSchema>;
