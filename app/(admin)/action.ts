"use server";
import {
  InventoryFormValues,
  InventorySchema,
  PatientSchema,
  ServiceFormValues,
  ServiceSchema,
} from "@/app/types";
import EmailTemplate from "@/components/emailTemplates/newAppointment";
import { createClient } from "@/utils/supabase/server";
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

export async function cancelAppointment({ aptId }: AppointmentActionProps) {
  const supabase = createClient();

  await supabase.from("appointments").update({ status: 3 }).eq("id", aptId);

  revalidatePath("/");
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
  const supabase = createClient();
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

  revalidatePath("/");
  redirect("/appointments");
}

export async function newApp(inputData: Inputs) {
  // Validate the input data
  const result = schema.safeParse(inputData);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient(); // Add Supabase client initialization params if needed
  const otpGenerator = require("otp-generator");

  // Generate a 6-digit appointment ticket
  const appointmentTicket = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  try {
    // Insert the appointment data into the "appointments" table and retrieve the inserted appointment with related data
    const { data: appointmentData, error: dbError } = await supabase
      .from("appointments")
      .insert([
        {
          patient_id: inputData.id,
          service: inputData.service,
          branch: inputData.branch,
          date: moment(inputData.date).format("MM/DD/YYYY"),
          time: inputData.time,
          status: inputData.status,
          type: inputData.type,
          appointment_ticket: appointmentTicket,
        },
      ])
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
        )
      `
      )
      .single(); // Ensure only a single row is returned

    if (dbError) {
      console.error("Error inserting appointment data:", dbError.message);
      return;
    }

    if (!appointmentData) {
      console.error("No appointment data returned after insertion.");
      return;
    }

    // Extract patient email from the related patient data
    const patientEmail = appointmentData.patients?.email;

    if (!patientEmail) {
      console.error(
        "No email found for the patient associated with this appointment."
      );
      return;
    }

    // Send the confirmation email using the retrieved appointment data
    const emailResponse = await resend.emails.send({
      from: "Appointment@email.lobodentdentalclinic.online",
      to: [patientEmail], // Send to the patient's email
      subject: "Appointment Confirmation",
      react: EmailTemplate({
        appointmentData, // Pass the newly created appointment with related data
      }) as React.ReactElement, // Ensure this matches your email service's expected format
    });

    // Check if the email was sent successfully
    if (emailResponse.error) {
      console.error(
        "Error sending confirmation email:",
        emailResponse.error.message
      );
      return;
    }

    console.log(
      "Appointment created successfully with ticket:",
      appointmentTicket,
      "and confirmation email sent to:",
      patientEmail
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
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
