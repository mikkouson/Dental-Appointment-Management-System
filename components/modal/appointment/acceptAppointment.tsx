"use client";

import { SelectDoctorSchema, UpdateInventorySchema } from "@/app/types";
import ToothHistoryCard from "@/components/cards/toothHistoryCard";
import { toast } from "@/components/hooks/use-toast";
import { usePatientsDetails } from "@/components/hooks/usePatientDetails";
import TeethChart from "@/components/teeth-permanent";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  User,
} from "lucide-react";
import { acceptAppointment } from "@/app/(admin)/appointments/action";
import { useDoctor } from "@/components/hooks/useDoctor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import Field from "@/components/forms/formField";
export function AcceptAppointment({
  disabled,
  appointment,
  patientId,
  mutate,
}: {
  disabled: boolean;
  appointment: any;
  patientId: any;
  mutate: any;
}) {
  const [open, setOpen] = useState(false);
  const { data, error, isLoading } = usePatientsDetails(patientId);
  const { doctors, doctorError, doctorLoading } = useDoctor();
  const filteredDoctors = doctors?.data?.filter(
    (doctor: any) => doctor.branch.id === appointment.branch.id
  );

  console.log(doctors);
  const form = useForm<z.infer<typeof SelectDoctorSchema>>({
    resolver: zodResolver(SelectDoctorSchema),
  });
  const { isSubmitting } = form.formState;

  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ""), 0);
  });
  async function onSubmit(data: z.infer<typeof SelectDoctorSchema>) {
    mutate(); // Revalidate to ensure data consistency

    try {
      mutate(); // Revalidate to ensure data consistency

      await acceptAppointment({ aptId: appointment.id, data });
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "success",
        description: "Doctor added successfully.",
        duration: 2000,
      });
      mutate(); // Revalidate to ensure data consistency
      setOpen(false); // Close the modal
    } catch (error: any) {
      // Revert the optimistic update in case of an error
      mutate();
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: `Failed to add doctor: ${error.message}`,
        duration: 2000,
      });
    }
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button disabled={disabled} variant="outline" size="sm">
          Accept
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-full md:w-[800px] overflow-auto"
        onInteractOutside={(e) => {
          const hasPacContainer = e.composedPath().some((el: EventTarget) => {
            if ("classList" in el) {
              return Array.from((el as Element).classList).includes(
                "pac-container"
              );
            }
            return false;
          });

          if (hasPacContainer) {
            e.preventDefault();
          }
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2">
            <SheetHeader>
              <SheetTitle>Accept Appointment</SheetTitle>
              <SheetDescription>
                Make changes to the appointment here. Click save when youre
                done.
              </SheetDescription>
            </SheetHeader>
            <Tabs defaultValue="details" className="w-full mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="chart">Odontogram</TabsTrigger>
              </TabsList>

              <TabsContent
                value="chart"
                className="flex flex-col justify-center items-center gap-4"
              >
                <h4 className="text-lg font-semibold py-10">
                  Patient Tooth Condtion
                </h4>

                <div className="pointer-events-none select-none opacity-90">
                  <TeethChart history={data?.tooth_history} id={patientId} />
                </div>
                <ToothHistoryCard
                  edit={true}
                  treatments={data?.tooth_history}
                  showDropDown={false}
                />
              </TabsContent>
              <TabsContent value="details">
                <div className="mt-6 space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage
                        src="/placeholder.svg?height=64&width=64"
                        alt="Dr. Smith"
                      />
                      <AvatarFallback>DS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{data?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {data?.email}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  {/* <h4 className="text-sm font-semibold">Assign a doctor</h4>

                  <div className="flex items-center space-x-4"> */}
                  {/* <Avatar className="w-16 h-16">
                  <AvatarImage
                    src="/placeholder.svg?height=64&width=64"
                    alt="Dr. Smith"
                  />
                  <AvatarFallback>DS</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{data?.name}</h3>
                  <p className="text-sm text-muted-foreground">{data?.email}</p>
                </div> */}
                  {/* <div className="w-full">
                      {filteredDoctors?.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No doctors available for this branch.
                        </p>
                      ) : (
                        <Field
                          form={form}
                          name={"id"}
                          label={"Doctor"}
                          data={filteredDoctors}
                        />
                      )}
                    </div>
                  </div> */}

                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Patient Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {/* <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>John Doe</span>
                </div> */}
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>DOB: {data?.dob} </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>(+639) {data?.phone_number}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>Sex: {data?.sex}</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">
                      Appointment Details
                    </h4>

                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>DATE: {appointment?.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Stethoscope className="w-4 h-4 text-primary" />
                      <span>SERVICE: {appointment?.services?.name}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>TIME: {appointment?.time_slots?.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>Branch: {appointment.branch.name}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-4 mt-8">
              <Button
                variant="destructive"
                onClick={() => setOpen(false)}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="outline"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
