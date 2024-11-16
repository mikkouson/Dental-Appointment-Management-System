"use server";
import {
  InventoryFormValues,
  InventorySchema,
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

export async function deleteAppointment(id: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("appointments")
    .update({
      deleteOn: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error deleting appointment", error.message); // Changed log to error for better debugging
    throw error; // Throw the error to be handled by the caller
  }
}
