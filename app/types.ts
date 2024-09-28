import { z } from "zod";

export const PatientSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name is required." }),
  phoneNumber: z.coerce
    .number()
    .min(100000000, { message: "Invalid Phone Number" })
    .max(999999999, { message: "Invalid Phone Number" }),
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
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  status: z.string({
    required_error: "A status is required.",
  }),
});

export type PatientFormValues = z.infer<typeof PatientSchema>;

export const ServiceSchema = z.object({
  id: z.number().optional(),
  description: z.string().min(1, { message: "Description is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  price: z.number().min(1, { message: "Price is required." }),
});

export type ServiceFormValues = z.infer<typeof ServiceSchema>;
