"use server";
import {
  SelectDoctorFormValues,
  UpdateInventoryFormValues,
  UpdateInventorySchema,
} from "@/app/types";
import DentalAppointmentCancellationEmail from "@/components/emailTemplates/cancelAppointment";
import DentalAppointmentEmail from "@/components/emailTemplates/newAppointment";
import DentalAppointmentPendingEmail from "@/components/emailTemplates/pendingAppointment";
import DentalAppointmentRejectionEmail from "@/components/emailTemplates/rejectAppointment";
import { createClient } from "@/utils/supabase/server";
import moment from "moment";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as React from "react";
import { Resend } from "resend";
import { z } from "zod";
import { createMultipleToothHistory } from "../action";
import RescheduleAcceptEmail from "@/components/emailTemplates/rescheduleAccept";
import RejectReschedule from "@/components/emailTemplates/rescheduleReject";

const resend = new Resend(process.env.RESEND_API_KEY);
interface AppointmentActionProps {
  aptId: number;
  data?: SelectDoctorFormValues;
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

export async function acceptAppointment({
  aptId,
  data,
}: AppointmentActionProps) {
  const supabase = createClient();
  const otpGenerator = require("otp-generator");

  const appointmentTicket = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const { data: appointmentData, error: updateError } = await supabase
    .from("appointments")
    .update({
      status: 1,
      appointment_ticket: appointmentTicket,
      doctor: data?.id,
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

  if (updateError || !appointmentData?.patients?.email) {
    throw new Error(
      `Error updating appointment: ${
        updateError?.message || "No patient email found"
      }`
    );
  }

  const emailResponse = await resend.emails.send({
    from: "Appointment@email.lobodentdentalclinic.online",
    to: [appointmentData.patients.email],
    subject: "Appointment Confirmation",
    react: DentalAppointmentEmail({ appointmentData }) as React.ReactElement,
  });

  if (emailResponse.error) {
    throw new Error(
      `Error sending confirmation email: ${emailResponse.error.message}`
    );
  }

  console.log(
    "Appointment created successfully with ticket:",
    appointmentTicket,
    "and confirmation email sent to:",
    appointmentData.patients.email
  );

  revalidatePath("/");
  // redirect("/appointments?tab=calendar");
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
  // redirect("/appointments?tab=calendar");
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
  revalidatePath("/");

  // Redirect after all the async operations are complete
  // redirect("/appointments?tab=calendar");
}

export async function rejectAppointment({ aptId }: AppointmentActionProps) {
  const supabase = createClient();

  try {
    // Update appointment status and fetch related patient data
    const { data: appointmentData, error: updateError } = await supabase
      .from("appointments")
      .update({ status: 5 })
      .eq("id", aptId)
      .select("*, patients(*)")
      .single();

    if (updateError || !appointmentData?.patients?.email) {
      throw new Error(
        `Error updating appointment: ${
          updateError?.message || "No patient email found"
        }`
      );
    }

    const { email: patientEmail } = appointmentData.patients;

    // Send rejection email to patient
    const { error: emailError } = await resend.emails.send({
      from: "Appointment@email.lobodentdentalclinic.online",
      to: [patientEmail],
      subject: "Appointment Rejection",
      react: DentalAppointmentRejectionEmail() as React.ReactElement,
    });

    if (emailError) {
      throw new Error(`Error sending rejection email: ${emailError.message}`);
    }

    console.log("Appointment rejection email sent to:", patientEmail);
    revalidatePath("/");
  } catch (error) {
    console.error("Error during appointment rejection:", error);
    throw error;
  }
  revalidatePath("/");

  // redirect("/appointments?tab=calendar");
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

  const { data: existingAppointment, error: fetchError } = await supabase
    .from("appointments")
    .select("status")
    .eq("id", data.id)
    .single();

  if (fetchError) {
    console.error("Error fetching existing appointment:", fetchError.message);
    return;
  }

  const statusChanged = existingAppointment.status !== data.status;

  // Fix: Use local date string instead of UTC conversion
  const formattedDate = moment(data.date).format("MM-DD-YYYY");

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

  // Rest of the status handling code remains the same
  if (statusChanged) {
    switch (data.status) {
      case 1:
        console.log("Calling acceptAppointment");
        await acceptAppointment({ aptId: data.id });
        break;
      case 2:
        console.log("Calling pending");
        await pendingAppointment({ aptId: data.id });
        break;
      case 3:
        console.log("Calling cancelAppointment");
        await cancelAppointment({ aptId: data.id });
        break;
      case 5:
        console.log("Calling rejectAppointment");
        await rejectAppointment({ aptId: data.id });
        break;
      default:
        console.log("No additional actions required for status:", data.status);
    }
  } else {
    console.log("Status has not changed, no further actions required.");
  }

  revalidatePath("/");
}

export async function newApp(data: Inputs) {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.log("Validation errors:", result.error.format());
    return;
  }

  const supabase = createClient();

  // Fix: Use local date format instead of UTC conversion
  const formattedDate = moment(data.date).format("MM/DD/YYYY");

  const { error, data: newAppointmentData } = await supabase
    .from("appointments")
    .insert([
      {
        patient_id: data.id,
        service: data.service,
        branch: data.branch,
        date: formattedDate,
        time: data.time,
        status: data.status,
        type: data.type,
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Error inserting data:", error.message);
    return;
  }

  console.log("Data inserted successfully");

  if (data.status === 2 && newAppointmentData) {
    await pendingAppointment({ aptId: newAppointmentData.id });
  }
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
  // redirect("/appointments?tab=calendar");
}

// export async function acceptReschedule(
//   aptId: number,
//   date: Date,
//   time: number
// ) {
//   const supabase = createClient();

//   const { error } = await supabase
//     .from("appointments")
//     .update({
//       status: 1,
//       date: date,
//       time: time,
//       reschedule_date: null,
//       reschedule_time: null,
//     })
//     .eq("id", aptId);

//   if (error) {
//     console.error("Error accepting reschedule:", error.message);
//     throw new Error(error.message);
//   }

//   console.log("Reschedule accepted successfully");
// }

export async function acceptReschedule(
  aptId: number,
  date: Date,
  time: number
) {
  const supabase = createClient();

  // Fix: Format the date properly without UTC conversion
  const formattedDate = moment(date).format("MM-DD-YYYY");

  const { data: appointmentData, error: updateError } = await supabase
    .from("appointments")
    .update({
      status: 1,
      date: formattedDate,
      time: time,
      rescheduled_date: null,
      rescheduled_time: null,
    })
    .eq("id", aptId)
    .select(
      `
      *,
      patients (*),
      services (*),
      time_slots (*),
      status (*),
      branch (*)
    `
    )
    .single();

  // Rest of the code remains the same
  if (updateError) {
    console.error("Error accepting reschedule:", updateError.message);
    throw new Error(updateError.message);
  }

  const patientEmail = appointmentData.patients?.email;

  if (!patientEmail) {
    throw new Error(
      "No email found for the patient associated with this appointment."
    );
  }

  const emailResponse = await resend.emails.send({
    from: "Appointment@email.lobodentdentalclinic.online",
    to: [patientEmail],
    subject: "Reschedule Accepted",
    react: RescheduleAcceptEmail({ appointmentData }) as React.ReactElement,
  });

  if (emailResponse.error) {
    throw new Error(
      `Error sending reschedule acceptance email: ${emailResponse.error.message}`
    );
  }

  console.log(
    "Reschedule accepted successfully and email sent to:",
    patientEmail
  );
  revalidatePath("/");
}
export async function rejectReschedule(aptId: number) {
  const supabase = createClient();

  const { data: appointmentData, error: fetchError } = await supabase
    .from("appointments")
    .update({
      status: 1,
      rescheduled_date: null,
      rescheduled_time: null,
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

  if (fetchError) {
    console.error("Error rejecting reschedule:", fetchError.message);
    throw new Error(fetchError.message);
  }

  const patientEmail = appointmentData.patients?.email;

  if (!patientEmail) {
    throw new Error(
      "No email found for the patient associated with this appointment."
    );
  }

  const emailResponse = await resend.emails.send({
    from: "Appointment@email.lobodentdentalclinic.online",
    to: [patientEmail],
    subject: "Reschedule Request Rejected",
    react: RejectReschedule() as React.ReactElement,
  });

  if (emailResponse.error) {
    throw new Error(
      `Error sending reschedule rejection email: ${emailResponse.error.message}`
    );
  }

  console.log("Reschedule rejected and email sent to:", patientEmail);
  revalidatePath("/");
  // redirect("/appointments?tab=calendar");
}
