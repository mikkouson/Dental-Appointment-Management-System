"use server";
import {
  InventoryFormValues,
  InventorySchema,
  PatientSchema,
  ServiceFormValues,
  ServiceSchema,
  UserForm,
} from "@/app/types";
import DentalAppointmentCancellationEmail from "@/components/emailTemplates/cancelAppointment";
import DentalAppointmentEmail from "@/components/emailTemplates/newAppointment";
import DentalAppointmentPendingEmail from "@/components/emailTemplates/pendingAppointment";
import DentalAppointmentRejectionEmail from "@/components/emailTemplates/rejectAppointment";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import moment from "moment";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as React from "react";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);
interface AppointmentActionProps {
  aptId: number;
}

const schema = z.object({
  id: z.number().optional(),
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

type Inputs = z.infer<typeof schema>;

type patientInput = z.infer<typeof PatientSchema>;
export async function acceptAppointment({ aptId }: AppointmentActionProps) {
  const supabase = createClient();
  const otpGenerator = require("otp-generator");
  // Generate a 6-digit appointment ticket
  const appointmentTicket = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  // Combine status and appointment_ticket updates in one query
  const { data: appointmentData, error: updateError } = await supabase
    .from("appointments")
    .update({
      status: 1, // Accept the appointment (status 1)
      appointment_ticket: appointmentTicket, // Add the generated appointment ticket
    })
    .eq("id", aptId)
    .select(
      `
      *,
      patients (
        *
      ),
      services (
        *
      ),
      time_slots (
        *
      ),
      status (
        *
      ),
      branch (
        *
      )
    `
    )
    .single();

  if (updateError) {
    throw new Error(`Error updating appointment: ${updateError.message}`);
  }

  // Extract patient email from the related patient data
  const patientEmail = appointmentData.patients?.email;

  if (!patientEmail) {
    throw new Error(
      "No email found for the patient associated with this appointment."
    );
  }

  // Send the confirmation email using the retrieved appointment data
  const emailResponse = await resend.emails.send({
    from: "Appointment@email.lobodentdentalclinic.online",
    to: [patientEmail], // Send to the patient's email
    subject: "Appointment Confirmation",
    react: DentalAppointmentEmail({
      appointmentData, // Pass the newly updated appointment with related data
    }) as React.ReactElement, // Ensure this matches your email service's expected format
  });

  // Check if the email was sent successfully
  if (emailResponse.error) {
    throw new Error(
      `Error sending confirmation email: ${emailResponse.error.message}`
    );
  }

  console.log(
    "Appointment created successfully with ticket:",
    appointmentTicket,
    "and confirmation email sent to:",
    patientEmail
  );

  // Revalidate the path to update the cache
  revalidatePath("/");

  // Redirect after all the async operations are complete
  redirect("/appointments");
}

export async function cancelAppointment({ aptId }: AppointmentActionProps) {
  const supabase = createClient();

  // Combine status and appointment_ticket updates in one query
  const { data: appointmentData, error: updateError } = await supabase
    .from("appointments")
    .update({
      status: 3,
    })
    .eq("id", aptId)
    .select(
      `
        *,
        patients (
          *
        )
      `
    )
    .single();

  if (updateError) {
    throw new Error(`Error updating appointment: ${updateError.message}`);
  }

  // Extract patient email from the related patient data
  const patientEmail = appointmentData.patients?.email;
  console.log("Appointment cancellation email sent to:", patientEmail);
  if (!patientEmail) {
    throw new Error(
      "No email found for the patient associated with this appointment."
    );
  }

  // Send the confirmation email using the retrieved appointment data
  const emailResponse = await resend.emails.send({
    from: "Appointment@email.lobodentdentalclinic.online",
    to: [patientEmail], // Send to the patient's email
    subject: "Appointment Cancelled",
    react: DentalAppointmentCancellationEmail() as React.ReactElement, // Ensure this matches your email service's expected format
  });

  // Check if the email was sent successfully
  if (emailResponse.error) {
    throw new Error(
      `Error sending confirmation email: ${emailResponse.error.message}`
    );
  }

  console.log("and confirmation email sent to:", patientEmail);

  // Revalidate the path to update the cache
  revalidatePath("/");

  // Redirect after all the async operations are complete
  redirect("/appointments");
}

export async function pendingAppointment({ aptId }: AppointmentActionProps) {
  const supabase = createClient();

  try {
    // Combine status and appointment_ticket updates in one query
    const { data: appointmentData, error: updateError } = await supabase
      .from("appointments")
      .update({
        status: 2,
      })
      .eq("id", aptId)
      .select(
        `
        *,
        patients (
          *
        )
      `
      )
      .single();

    if (updateError) {
      throw new Error(`Error updating appointment: ${updateError.message}`);
    }

    // Extract patient email from the related patient data
    const patientEmail = appointmentData.patients?.email;

    if (!patientEmail) {
      throw new Error(
        "No email found for the patient associated with this appointment."
      );
    }

    // Send the confirmation email using the retrieved appointment data
    const emailResponse = await resend.emails.send({
      from: "Appointment@email.lobodentdentalclinic.online",
      to: [patientEmail], // Send to the patient's email
      subject: "Appointment Application",
      react: DentalAppointmentPendingEmail() as React.ReactElement, // Ensure this matches your email service's expected format
    });

    // Check if the email was sent successfully
    if (emailResponse.error) {
      throw new Error(
        `Error sending confirmation email: ${emailResponse.error.message}`
      );
    }

    console.log("Appointment rejection email sent to:", patientEmail);

    // Revalidate the path to update the cache
    revalidatePath("/");
  } catch (error) {
    // Catch any errors that occur during the process and log them
    console.error("An error occurred during appointment acceptance:", error);
  }

  // Redirect after all the async operations are complete
  redirect("/appointments");
}

export async function rejectAppointment({ aptId }: AppointmentActionProps) {
  const supabase = createClient();

  try {
    // Combine status and appointment_ticket updates in one query
    const { data: appointmentData, error: updateError } = await supabase
      .from("appointments")
      .update({
        status: 5,
      })
      .eq("id", aptId)
      .select(
        `
        *,
        patients (
          *
        )
      `
      )
      .single();

    if (updateError) {
      throw new Error(`Error updating appointment: ${updateError.message}`);
    }

    // Extract patient email from the related patient data
    const patientEmail = appointmentData.patients?.email;

    if (!patientEmail) {
      throw new Error(
        "No email found for the patient associated with this appointment."
      );
    }

    // Send the confirmation email using the retrieved appointment data
    const emailResponse = await resend.emails.send({
      from: "Appointment@email.lobodentdentalclinic.online",
      to: [patientEmail], // Send to the patient's email
      subject: "Appointment Rejection",
      react: DentalAppointmentRejectionEmail() as React.ReactElement, // Ensure this matches your email service's expected format
    });

    // Check if the email was sent successfully
    if (emailResponse.error) {
      throw new Error(
        `Error sending confirmation email: ${emailResponse.error.message}`
      );
    }

    console.log("Appointment rejection email sent to:", patientEmail);

    // Revalidate the path to update the cache
    revalidatePath("/");
  } catch (error) {
    // Catch any errors that occur during the process and log them
    console.error("An error occurred during appointment acceptance:", error);
  }

  // Redirect after all the async operations are complete
  redirect("/appointments");
}
export async function deleteAppointment(id: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("appointments")
    .update({
      deleteOn: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    console.log("Error deleting appointment", error.message);
  }
}

export async function rescheduleAppointment(data: Inputs) {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }
  if (data.id === undefined) {
    console.error("Appointment ID is missing or undefined.");
    return;
  }

  const supabase = createClient();

  // Fetch the existing appointment to check if status has changed
  const { data: existingAppointment, error: fetchError } = await supabase
    .from("appointments")
    .select("status")
    .eq("id", data.id)
    .single();

  if (fetchError) {
    console.error("Error fetching existing appointment:", fetchError.message);
    return;
  }

  // Check if status has changed
  const statusChanged = existingAppointment.status !== data.status;

  const formattedDate = moment
    .utc(data.date)
    .add(8, "hours")
    .format("MM-DD-YYYY");

  const { error } = await supabase
    .from("appointments")
    .update({
      service: data.service,
      branch: data.branch,
      date: formattedDate,
      time: data.time,
      status: data.status,
      type: data.type,
    })
    .eq("id", data.id);

  if (error) {
    console.error("Error updating appointment:", error.message);
    return;
  }

  // If status has changed, proceed to call the appropriate function
  if (statusChanged) {
    switch (data.status) {
      case 1: // Accepted
        console.log("Calling acceptAppointment");
        await acceptAppointment({ aptId: data.id });
        break;
      case 2: // Accepted
        console.log("Calling pendinga");
        await pendingAppointment({ aptId: data.id });
        break;
      case 3: // Cancelled
        console.log("Calling cancelAppointment");
        await cancelAppointment({ aptId: data.id });
        break;
      case 5: // Rejected
        console.log("Calling rejectAppointment");
        await rejectAppointment({ aptId: data.id });
        break;
      default:
        console.log("No additional actions required for status:", data.status);
    }
  } else {
    console.log("Status has not changed, no further actions required.");
  }

  // Revalidate the path and redirect
  revalidatePath("/");
  redirect("/appointments");
}

export async function newApp(data: Inputs) {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  const { error, data: newAppointmentData } = await supabase
    .from("appointments")
    .insert([
      {
        patient_id: data.id,
        service: data.service,
        branch: data.branch,
        date: moment(data.date).format("MM/DD/YYYY"),
        time: data.time,
        status: data.status,
        type: data.type,
      },
    ])
    .select("id")
    .single(); // Fetch the inserted appointment data with its ID

  if (error) {
    console.error("Error inserting data:", error.message);
    return;
  }

  console.log("Data inserted successfully");

  // If the status is 2 (pending), call the pendingAppointment function
  if (data.status === 2 && newAppointmentData) {
    await pendingAppointment({ aptId: newAppointmentData.id });
  }
}

export async function newPatient(data: patientInput) {
  const result = PatientSchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  // Step 1: Insert address and get the ID
  const { data: addressData, error: addressError } = await supabase
    .from("addresses")
    .insert([
      {
        address: data.address.address,
        latitude: data.address.latitude,
        longitude: data.address.longitude,
      },
    ])
    .select("id") // Select the id of the newly inserted address
    .single();

  if (addressError || !addressData) {
    console.error("Error inserting address:", addressError?.message);
    return;
  }

  const addressId = addressData.id;

  // Step 2: Insert patient with the address ID
  const { error: patientError } = await supabase.from("patients").insert([
    {
      name: data.name,
      email: data.email,
      sex: data.sex,
      address: addressId,
      phone_number: data.phoneNumber,
      dob: data.dob,
      status: data.status,
    },
  ]);

  if (patientError) {
    console.error("Error inserting patient:", patientError.message);
  } else {
    console.log("Patient data inserted successfully");
  }
}

export async function deletePatient(id: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("patients")
    .update({
      deleteOn: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    console.log("Error deleting patient", error.message);
  }
}
export async function updatePatient(data: patientInput) {
  const result = PatientSchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  // Check if address ID is provided
  if (!data.address.id) {
    console.error("Address ID is missing or undefined.");
    return;
  }

  // Update address
  const { error: addressError } = await supabase
    .from("addresses")
    .update({
      address: data.address.address,
      latitude: data.address.latitude,
      longitude: data.address.longitude,
    })
    .eq("id", data.address.id);

  if (addressError) {
    console.error("Error updating address:", addressError.message);
    return;
  }

  // Update patient
  const { error: patientError } = await supabase
    .from("patients")
    .update({
      name: data.name,
      email: data.email,
      sex: data.sex,
      phone_number: data.phoneNumber,
      dob: data.dob,
      status: data.status,
    })
    .eq("id", data.id);

  if (patientError) {
    console.error("Error updating patient:", patientError.message);
  } else {
    console.log("Patient data updated successfully");
  }
}

// Service Actions

export async function newService(data: ServiceFormValues) {
  const result = ServiceSchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  const { error } = await supabase.from("services").insert([
    {
      name: data.name,
      description: data.description,
      price: data.price,
    },
  ]);

  if (error) {
    console.error("Error inserting patient:", error.message);
  } else {
    console.log("Patient data inserted successfully");
  }
}

export async function deleteService(id: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("services")
    .update({
      deleteOn: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    console.log("Error deleting patient", error.message);
  }
}

export async function updateService(data: ServiceFormValues) {
  const result = ServiceSchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  // Update patient
  const { error } = await supabase
    .from("services")
    .update({
      name: data.name,
      price: data.price,
      description: data.description,
    })
    .eq("id", data.id);

  if (error) {
    console.error("Error updating patient:", error.message);
  } else {
    console.log("Patient data updated successfully");
  }
}

// Inventory Actions

export async function newInventory(data: InventoryFormValues) {
  const result = InventorySchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  const { error } = await supabase.from("inventory").insert([
    {
      name: data.name,
      description: data.description,
      quantity: data.quantity,
    },
  ]);

  if (error) {
    console.error("Error inserting patient:", error.message);
  } else {
    console.log("Patient data inserted successfully");
  }
}

export async function updateInventory(data: InventoryFormValues) {
  const result = InventorySchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  // Update patient
  const { error } = await supabase
    .from("inventory")
    .update({
      name: data.name,
      quantity: data.quantity,
      description: data.description,
    })
    .eq("id", data.id);

  if (error) {
    console.error("Error updating patient:", error.message);
  } else {
    console.log("Patient data updated successfully");
  }
}

export async function deleteInventory(id: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("inventory")
    .update({
      deleteOn: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    console.log("Error deleting patient", error.message);
  }
}

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export async function createNewUser(formData: UserForm) {
  const result = FormSchema.safeParse(formData);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  // Sign up the user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });

  if (signUpError) {
    console.error("Error creating user:", signUpError.message);
    return;
  }

  // Insert user profile into 'profiles' table after successful sign-up
  const userId = signUpData.user?.id;

  if (userId) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        id: userId, // Assuming 'id' in profiles table is the same as the user's ID
        name: formData.name,
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Error inserting profile:", profileError.message);
    }
  }

  // Optionally, you can revalidate and redirect after everything is successful
  revalidatePath("/", "layout");
  redirect("/users");
}

export async function deleteUser(id: number) {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(id.toString());

  if (error) {
    console.log("Error deleting patient", error.message);
  }
}

export async function updateUser(formData: UserForm) {
  const result = FormSchema.safeParse(formData);
  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  if (!formData?.id) {
    console.log("User ID is missing.");
    return;
  }

  const supabase = createAdminClient();
  const { data: user, error } = await supabase.auth.admin.updateUserById(
    formData.id, // Ensure formData.id is not undefined
    {
      email: formData.email,
      password: formData.password,
    }
  );

  if (error) {
    console.log("Error deleting patient", error.message);
  }
}
