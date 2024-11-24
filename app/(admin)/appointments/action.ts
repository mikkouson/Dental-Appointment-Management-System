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
  const moment = require("moment-timezone");

  const dateInPHT = moment().tz("Asia/Manila");
  const { data: appointmentData, error: updateError } = await supabase
    .from("appointments")
    .update({
      status: 1,
      appointment_ticket: appointmentTicket,
      doctor: data?.id,
      accepted_at: dateInPHT.toDate(),
    })
    .eq("id", aptId)
    .select(
      `*, patients (*), services (*), time_slots (*), status (*), branch (*)`
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
}

export async function cancelAppointment({ aptId }: AppointmentActionProps) {
  const supabase = createClient();
  const moment = require("moment-timezone");
  const dateInPHT = moment().tz("Asia/Manila");

  const { data: appointmentData, error: updateError } = await supabase
    .from("appointments")
    .update({
      status: 3,
      cancelled_at: dateInPHT.toDate(),
    })
    .eq("id", aptId)
    .select(`*, patients (*)`)
    .single();

  if (updateError) {
    throw new Error(`Error updating appointment: ${updateError.message}`);
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
    subject: "Appointment Cancelled",
    react: DentalAppointmentCancellationEmail() as React.ReactElement,
  });

  if (emailResponse.error) {
    throw new Error(
      `Error sending confirmation email: ${emailResponse.error.message}`
    );
  }

  console.log("Cancellation email sent to:", patientEmail);
  revalidatePath("/");
}
export async function pendingAppointment({ aptId }: AppointmentActionProps) {
  const supabase = createClient();
  const moment = require("moment-timezone");
  const dateInPHT = moment().tz("Asia/Manila");

  const { data: appointmentData, error: updateError } = await supabase
    .from("appointments")
    .update({
      status: 2,
      pending_at: dateInPHT.toDate(),
    })
    .eq("id", aptId)
    .select(`*, patients (*)`)
    .single();

  if (updateError) {
    throw new Error(`Error updating appointment: ${updateError.message}`);
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
    subject: "Appointment Application",
    react: DentalAppointmentPendingEmail() as React.ReactElement,
  });

  if (emailResponse.error) {
    throw new Error(
      `Error sending confirmation email: ${emailResponse.error.message}`
    );
  }

  console.log("Appointment pending email sent to:", patientEmail);
  revalidatePath("/");
}

export async function rejectAppointment({ aptId }: AppointmentActionProps) {
  const supabase = createClient();
  const moment = require("moment-timezone");
  const dateInPHT = moment().tz("Asia/Manila");

  const { data: appointmentData, error: updateError } = await supabase
    .from("appointments")
    .update({
      status: 5,
      rejected_at: dateInPHT.toDate(),
    })
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
}

export async function deleteAppointment(id: number) {
  const supabase = createClient();
  const moment = require("moment-timezone");
  const dateInPHT = moment().tz("Asia/Manila");

  const { error } = await supabase
    .from("appointments")
    .update({
      deleteOn: dateInPHT.toDate(),
      status: 6,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Error deleting appointment: ${error.message}`);
  }

  revalidatePath("/");
}
export async function rescheduleAppointment(data: Inputs) {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Validation failed: ${JSON.stringify(result.error.format())}`
    );
  }

  if (data.id === undefined) {
    throw new Error("Appointment ID is missing or undefined");
  }

  const supabase = createClient();

  const { data: existingAppointment, error: fetchError } = await supabase
    .from("appointments")
    .select("status")
    .eq("id", data.id)
    .single();

  if (fetchError) {
    throw new Error(
      `Failed to fetch existing appointment: ${fetchError.message}`
    );
  }

  const statusChanged = existingAppointment.status !== data.status;

  // Format date using Moment.js with PHT timezone
  const moment = require("moment-timezone");
  const dateInPHT = moment(data.date).tz("Asia/Manila");

  if (!dateInPHT.isValid()) {
    throw new Error("Invalid date provided");
  }

  console.log("Original date:", data.date);
  console.log("PHT date:", dateInPHT.format());

  // Format date as MM-DD-YYYY in PHT
  const formattedDate = dateInPHT.format("MM-DD-YYYY");

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
    throw new Error(`Failed to update appointment: ${error.message}`);
  }

  try {
    // Status handling code
    if (statusChanged) {
      switch (data.status) {
        case 1:
          await acceptAppointment({ aptId: data.id });
          break;
        case 2:
          await pendingAppointment({ aptId: data.id });
          break;
        case 3:
          await cancelAppointment({ aptId: data.id });
          break;
        case 5:
          await rejectAppointment({ aptId: data.id });
          break;
        default:
          console.log(
            "No additional actions required for status:",
            data.status
          );
      }
    }

    revalidatePath("/");
  } catch (error) {
    throw new Error(
      `Failed to process status change: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
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
  const moment = require("moment-timezone");
  const dateInPHT = moment().tz("Asia/Manila");

  const { data: appointmentData, error: updateError } = await supabase
    .from("appointments")
    .update({
      status: 4,
      completed_at: dateInPHT.toDate(),
    })
    .eq("id", id)
    .select(`*, patients (*)`)
    .single();

  if (updateError) {
    throw new Error(`Error updating appointment: ${updateError.message}`);
  }

  if (selectedItems && selectedItems.length > 0) {
    const insertData = selectedItems.map((item) => ({
      appointment_id: id,
      item_id: item.id,
      quantity: item.quantity,
      used_at: dateInPHT.toDate(),
    }));

    const { error: insertError } = await supabase
      .from("items_used")
      .insert(insertData);

    if (insertError) {
      throw new Error(`Error inserting inventory data: ${insertError.message}`);
    }
  }

  if (teethLocations && teethLocations.length > 0) {
    const toothHistoryData = teethLocations.map((location: any) => ({
      tooth_location: location.tooth_location,
      tooth_condition: location.tooth_condition,
      tooth_history: location.tooth_history,
      history_date: dateInPHT.toDate(),
      patient_id: appointmentData.patients.id,
      appointment_id: appointmentData.id,
    }));

    await createMultipleToothHistory(toothHistoryData);
  }

  revalidatePath("/");
}

export async function acceptReschedule(
  aptId: number,
  date: Date,
  time: number
) {
  const supabase = createClient();
  const moment = require("moment-timezone");

  const dateInPHT = moment(date).tz("Asia/Manila");
  const currentDatePHT = moment().tz("Asia/Manila");

  if (!dateInPHT.isValid()) {
    throw new Error("Invalid reschedule date provided");
  }

  const { data: appointmentData, error: updateError } = await supabase
    .from("appointments")
    .update({
      status: 1,
      date: dateInPHT.format("MM-DD-YYYY"),
      time: time,
      rescheduled_date: null,
      rescheduled_time: null,
      updated_at: currentDatePHT.toDate(),
    })
    .eq("id", aptId)
    .select(
      `*, patients (*), services (*), time_slots (*), status (*), branch (*)`
    )
    .single();

  if (updateError) {
    throw new Error(`Error accepting reschedule: ${updateError.message}`);
  }

  if (!appointmentData?.patients?.email) {
    throw new Error("No patient email found for this appointment");
  }

  const emailResponse = await resend.emails.send({
    from: "Appointment@email.lobodentdentalclinic.online",
    to: [appointmentData.patients.email],
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
    appointmentData.patients.email
  );
  revalidatePath("/");
}

export async function rejectReschedule(aptId: number) {
  const supabase = createClient();
  const moment = require("moment-timezone");

  const dateInPHT = moment().tz("Asia/Manila");

  const { data: appointmentData, error: fetchError } = await supabase
    .from("appointments")
    .update({
      status: 1,
      rescheduled_date: null,
      rescheduled_time: null,
      updated_at: dateInPHT.toDate(),
    })
    .eq("id", aptId)
    .select(`*, patients (*)`)
    .single();

  if (fetchError) {
    throw new Error(`Error rejecting reschedule: ${fetchError.message}`);
  }

  if (!appointmentData?.patients?.email) {
    throw new Error("No patient email found for this appointment");
  }

  const emailResponse = await resend.emails.send({
    from: "Appointment@email.lobodentdentalclinic.online",
    to: [appointmentData.patients.email],
    subject: "Reschedule Request Rejected",
    react: RejectReschedule() as React.ReactElement,
  });

  if (emailResponse.error) {
    throw new Error(
      `Error sending reschedule rejection email: ${emailResponse.error.message}`
    );
  }

  console.log(
    "Reschedule rejected and email sent to:",
    appointmentData.patients.email
  );
  revalidatePath("/");
}
