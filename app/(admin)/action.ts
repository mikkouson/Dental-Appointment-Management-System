"use server";
import {
  DoctorFormValues,
  DoctorSchema,
  InventoryFormValues,
  InventorySchema,
  PatientFormValues,
  PatientSchema,
  ServiceFormValues,
  ServiceSchema,
  ToothHistoryFormValue,
  UpdateInventoryFormValues,
  UpdateInventorySchema,
  UpdateUser,
  UpdateUserForm,
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
export async function newPatient(data: patientInput, teethLocations?: any) {
  const result = PatientSchema.safeParse(data);

  if (!result.success) {
    const validationErrors = result.error.format();
    console.log("Validation errors:", validationErrors);
    throw new Error("Validation errors occurred.");
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
    .select("id")
    .single();

  if (addressError || !addressData) {
    const errorMessage = addressError
      ? addressError.message
      : "Failed to insert address.";
    throw new Error(`Error inserting address: ${errorMessage}`);
  }

  const addressId = addressData.id;

  // Step 2: Insert patient with the address ID and get the patient ID
  const { data: patientData, error: patientError } = await supabase
    .from("patients")
    .insert([
      {
        name: data.name,
        email: data.email,
        sex: data.sex,
        address: addressId,
        phone_number: data.phoneNumber,
        dob: data.dob,
        status: data.status,
      },
    ])
    .select("id")
    .single();

  if (patientError) {
    throw new Error(`Error inserting patient: ${patientError.message}`);
  }

  // Step 3: Create tooth history records if teethLocations are provided
  // Step 3: If teethLocations are provided, call createMultipleToothHistory
  if (teethLocations && teethLocations.length > 0) {
    const toothHistoryData = teethLocations.map((location: any) => ({
      tooth_location: location.tooth_location,
      tooth_condition: location.tooth_condition,
      tooth_history: location.tooth_history,
      history_date: new Date(),
      patient_id: patientData.id,
    }));

    try {
      await createMultipleToothHistory(toothHistoryData);
    } catch (error) {
      console.error("Error creating multiple tooth history records:", error);
      // Continue execution even if tooth history creation fails
    }
  }
  console.log("Patient data inserted successfully");
  return { success: true, patientId: patientData?.id };
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
interface AddressInput {
  id?: number; // Changed from string to number
  address: string;
  latitude: number;
  longitude: number;
}

interface PatientInput {
  id: number; // Changed from string to number
  name: string;
  email: string;
  sex: string;
  phoneNumber: string;
  dob: string;
  status: string;
  address: AddressInput;
}

export async function updatePatient(data: PatientFormValues) {
  const result = PatientSchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  // Handle address update or creation
  let addressId: number; // Changed from string to number

  if (data.address.id) {
    // Update existing address
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
    addressId = data.address.id;
  } else {
    // Create new address
    const { data: newAddress, error: createError } = await supabase
      .from("addresses")
      .insert({
        address: data.address.address,
        latitude: data.address.latitude,
        longitude: data.address.longitude,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating address:", createError.message);
      return;
    }

    addressId = newAddress.id;
  }

  // Update patient with potentially new address ID
  const { error: patientError } = await supabase
    .from("patients")
    .update({
      name: data.name,
      email: data.email,
      sex: data.sex,
      phone_number: data.phoneNumber,
      dob: data.dob,
      status: data.status,
      address: addressId,
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
    throw error; // Throw the error to be handled by the caller
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
    throw new Error("Validation failed");
  }

  const supabase = createAdminClient();

  const { error } = await supabase.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    user_metadata: { name: formData.name },
    email_confirm: true, // This confirms the email without needing a timestamp
    role: "authenticated",
  });

  if (error) throw error; // Throw error to be caught in onSubmit

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

export async function updateUser(formData: UpdateUserForm) {
  const result = UpdateUser.safeParse(formData);
  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  if (!formData?.id) {
    console.log("User ID is missing.");
    return;
  }

  const supabase = createAdminClient();

  const updateData: {
    email: string;
    password?: string;
    user_metadata?: { name: string };
  } = {
    email: formData.email,
    user_metadata: { name: formData.name },
  };

  if (formData.newPassword && formData.newPassword.length > 0) {
    updateData.password = formData.newPassword;
  }

  const { data: user, error } = await supabase.auth.admin.updateUserById(
    formData.id,
    updateData
  );

  if (error) {
    throw new Error(`${error.message}`);
  }

  return user;
}

export async function completeAppointment(
  formData: UpdateInventoryFormValues,
  teethLocations: any
) {
  const validationResult = UpdateInventorySchema.safeParse(formData);
  if (!validationResult.success) {
    throw new Error("Invalid form data.");
  }

  const supabase = createClient();
  const { id, selectedItems } = formData;

  // Get appointment and patient data
  const { data: appointmentData, error: updateError } = await supabase
    .from("appointments")
    .update({ status: 4 })
    .eq("id", id)
    .select(
      `
      *,
      patients (*)
    `
    )
    .single();

  if (updateError) {
    throw new Error(`Error updating appointment: ${updateError.message}`);
  }

  // Handle inventory items
  const insertData = selectedItems.map((item) => ({
    appointment_id: id,
    item_id: item.id,
    quantity: item.quantity,
  }));

  const { error: insertError } = await supabase
    .from("items_used")
    .insert(insertData);

  if (insertError) {
    throw new Error(`Error inserting inventory data: ${insertError.message}`);
  }

  // Handle tooth history records
  if (teethLocations && teethLocations.length > 0) {
    const toothHistoryData = teethLocations.map((location: any) => ({
      tooth_location: location.tooth_location,
      tooth_condition: location.tooth_condition,
      tooth_history: location.tooth_history,
      history_date: new Date(),
      patient_id: appointmentData.patients.id,
      appointment_id: appointmentData.id,
    }));

    try {
      await createMultipleToothHistory(toothHistoryData);
      console.log("Tooth history records created successfully.");
    } catch (error) {
      console.error("Error creating tooth history records:", error);
      throw error;
    }
  }

  revalidatePath("/");
  redirect("/appointments");
}
export async function updateToothHistory(data: ToothHistoryFormValue) {
  // // If no ID is present, create a new record instead
  // if (!data.id) {
  //   return createToothHistory(data);
  // }

  const supabase = createClient();
  const { error } = await supabase
    .from("tooth_history")
    .update({
      ...data,
    })
    .eq("id", data.id);

  if (error) {
    console.error("Error updating tooth history:", error.message);
    // Throw an error to be caught by the calling function
    throw new Error(error.message);
  }

  // Return success response
  return { success: true };
}

export async function createToothHistory(data: ToothHistoryFormValue) {
  const supabase = createClient();
  const { error } = await supabase.from("tooth_history").insert([data]);

  if (error) {
    console.error("Error creating tooth history:", error.message);
    // Throw an error to be caught by the calling function
    throw new Error(error.message);
  }

  // Return success response
  return { success: true };
}

export async function deleteToothHistory(id: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("tooth_history")
    .update({
      deleteOn: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    console.log("Error deleting tooth history", error.message);
    throw new Error(error.message);
  }
}
export async function createMultipleToothHistory(
  data: ToothHistoryFormValue[]
) {
  const supabase = createClient();
  const { error } = await supabase.from("tooth_history").insert(data);

  if (error) {
    console.error("Error creating tooth history records:", error.message);
    throw new Error(error.message);
  }

  return { success: true };
}

// Doctor Actions

export async function newDoctor(data: DoctorFormValues) {
  const result = DoctorSchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  const { error } = await supabase.from("doctors").insert([
    {
      name: data.name,
      email: data.email,
      contact_info: data.contact_info,
    },
  ]);

  if (error) {
    console.error("Error inserting doctor data:", error.message);
  } else {
    console.log("Doctor data inserted successfully");
  }
}

export async function deleteDoctor(id: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("doctors")
    .update({
      deleteOn: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    console.log("Error deleting doctor data", error.message);
    throw error; // Throw the error to be handled by the caller
  }
}

export async function updateDoctor(data: DoctorFormValues) {
  const result = DoctorSchema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  // Update doctor
  const { error } = await supabase
    .from("doctors")
    .update({
      name: data.name,
      email: data.email,
      contact_info: data.contact_info,
    })
    .eq("id", data.id);

  if (error) {
    console.error("Error updating doctor data:", error.message);
  } else {
    console.log("Doctor data updated successfully");
  }
}
