import { z } from "zod";
export const AppointmentSchema = z.object({
  id: z.number(),
  patient: z.string().optional(),
  service: z.number({
    required_error: "Please select an email to display.",
  }),
  branch: z.number({
    required_error: "Please select an email to display.",
  }),
  date: z.date({
    required_error: "A date of birth is required.",
  }),
  time: z.number({
    required_error: "A date of birth is required.",
  }),
  type: z.string({
    required_error: "A date of birth is required.",
  }),
  status: z.number({
    required_error: "A date of birth is required.",
  }),
});
export type AppointmentSchemaType = z.infer<typeof AppointmentSchema>;
export const PatientSchema = z
  .object({
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
    sex: z.string().min(1, { message: "Sex is a required field" }),
    dob: z.date({
      required_error: "A date of birth is required.",
    }),
    status: z.string({
      required_error: "A status is required.",
    }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain at least 1 number")
      .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter"),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type PatientFormValues = z.infer<typeof PatientSchema>;

export const ServiceSchema = z.object({
  id: z.number().optional(),
  description: z.string().min(1, { message: "Description is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  price: z.number().min(1, { message: "Price is required." }),
});

export type ServiceFormValues = z.infer<typeof ServiceSchema>;

export const InventorySchema = z.object({
  id: z.number().optional(),
  description: z.string().min(1, { message: "Description is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  quantity: z.number(),
  branch: z.number().min(1, { message: "Name is required." }),
});

export type InventoryFormValues = z.infer<typeof InventorySchema>;

export const UpdateInventorySchema = z.object({
  id: z.number().optional(),

  selectedItems: z
    .array(
      z.object({
        id: z.number(), // Item ID (required)
        quantity: z.number().min(1), // Quantity (must be 1 or more)
      })
    )
    .min(1, { message: "Please select at least one item" }),
});

export type UpdateInventoryFormValues = z.infer<typeof UpdateInventorySchema>;

export const UserSchema = z
  .object({
    id: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }),
    name: z.string().min(3, { message: "name must be at least 3 characters" }),
    role: z.string().min(1, { message: "Sex is a required field" }),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain at least 1 number")
      .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Show error on confirm password field
  });

export type UserForm = z.infer<typeof UserSchema>;

export const DoctorSchema = z.object({
  id: z.number().optional(),
  email: z.string().min(1, { message: "Email is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  branch: z.number().min(1, { message: "Name is required." }),
  contact_info: z.coerce
    .number()
    .min(100000000, { message: "Invalid Phone Number" })
    .max(999999999, { message: "Invalid Phone Number" }),
});

export type DoctorFormValues = z.infer<typeof DoctorSchema>;

export const SelectDoctorSchema = z.object({
  id: z.number().min(1, { message: "Email is required." }),
});

export type SelectDoctorFormValues = z.infer<typeof SelectDoctorSchema>;

export const UpdateUser = z
  .object({
    id: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }),
    name: z.string().min(3, { message: "name must be at least 3 characters" }),
    role: z.string().min(1, { message: "Sex is a required field" }),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain at least 1 number")
      .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .optional(),

    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Show error on confirm password field
  });

export type UpdateUserForm = z.infer<typeof UpdateUser>;

export const ToothHistory = z.object({
  id: z.number().optional(),
  tooth_location: z.number(),
  tooth_condition: z
    .string()
    .min(1, { message: "Tooth Condition is required." }),
  tooth_history: z.string().optional(),
  history_date: z.date(),
  patient_id: z.number().optional(),
});

export type ToothHistoryFormValue = z.infer<typeof ToothHistory>;

export const FileUploadSchema = z.object({
  patient_id: z.number({
    required_error: "Patient ID is required.",
  }),
  file: z.object({
    name: z.string(),
  }),
});

export type FileUploadFormValues = z.infer<typeof FileUploadSchema>;
