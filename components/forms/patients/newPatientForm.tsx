import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PatientSchema, PatientFormValues } from "@/app/types";
import { cn } from "@/lib/utils";
import { toast } from "@/components/hooks/use-toast";
import TeethChart from "@/components/teeth-permanent";
import { useTeethArray } from "@/app/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToothHistoryCard from "@/components/cards/toothHistoryCard";
import { Button } from "@/components/ui/button";
import PatientFields from "./patientFields";
import { Patient, PatientCol } from "@/app/schema";
import { usePatients } from "@/components/hooks/usePatient";
import { newPatient } from "@/app/(admin)/patients/action";
import { useRouter } from "next/navigation";

interface NewPatientFormProps {
  setOpen: (open: boolean) => void;
  mutate: (
    data?: any | Promise<any> | undefined,
    shouldRevalidate?: boolean | undefined
  ) => Promise<any>;
}

export function NewPatientForm({ setOpen, mutate }: NewPatientFormProps) {
  const [step, setStep] = React.useState(0);
  const { teethLocations } = useTeethArray();
  const {
    patients: responseData,
    patientError,
    patientLoading,
  } = usePatients();
  const form = useForm<z.infer<typeof PatientSchema>>({
    resolver: zodResolver(PatientSchema),
    defaultValues: {
      name: "",
      email: "",
      sex: "",
    },
  });

  const steps = [
    {
      title: "Patient Information",
      description: "Enter patient's personal details",
    },
    {
      title: "Dental Chart",
      description: "Select teeth and add treatment history",
    },
  ];

  const currentStep = steps[step];

  // Function to validate current step before proceeding
  const validateStep = async () => {
    if (step === 0) {
      const result = await form.trigger(["name", "email", "sex"]);
      return result;
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setStep((prev) => prev - 1);
  };
  const patients: PatientCol[] = responseData?.data || [];

  // Function to check if email already exists
  const checkEmailExists = (email: string): boolean => {
    return patients.some(
      (patient: PatientCol) =>
        patient.email?.toLowerCase() === email.toLowerCase()
    );
  };
  // Function to check if name already exists
  const checkNameExists = (name: string): boolean => {
    return patients.some(
      (patient: PatientCol) =>
        patient.name?.toLowerCase() === name.toLowerCase()
    );
  };
  const router = useRouter();

  async function onSubmit(data: PatientFormValues) {
    // Check if email already exists in fetched data
    const emailExists = checkEmailExists(data.email);
    const nameExists = checkNameExists(data.name);

    let hasError = false;

    if (emailExists) {
      form.setError("email", {
        type: "manual",
        message: "Email already exists",
      });
      hasError = true;
    }
    if (nameExists) {
      form.setError("name", {
        type: "manual",
        message: "Patient name already exists",
      });
      hasError = true;
    }

    if (hasError) {
      setStep(0); // Go back to step 0
      return;
    }
    // Optimistically update the UI without assigning a temporary id
    const newItem = data; // Use the new data directly

    interface PatientData {
      data: Patient[];
      count: number;
    }

    mutate(
      (currentData: PatientData) => ({
        data: [newItem, ...currentData.data],
        count: currentData.count + 1,
      }),
      false // Do not revalidate yet
    );

    setOpen(false); // Close the modal

    try {
      await newPatient(data, teethLocations); // Ensure this function returns a promise
      // Show success toast immediately
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "success",
        description: "Patient added successfully.",
        duration: 2000,
      });

      mutate(); // Revalidate to ensure data consistency
    } catch (error: any) {
      // Revert the optimistic update in case of an error
      mutate();

      // Show error toast below the success message
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        variant: "destructive",
        description: `Failed to add patient: ${error.message}`,
        duration: 2000,
      });
    }
  }

  return (
    <div className="w-full">
      <div>
        <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
        <p className="text-muted-foreground mb-4">{currentStep.description}</p>
        <div className="flex mb-2">
          {steps.map((_, index) => (
            <React.Fragment key={index}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 my-auto mx-2 ${
                    index < step ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {step === 0 ? (
        <PatientFields form={form} onSubmit={handleNext} />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-center items-center">
            <TeethChart history={[]} newPatient={true} showTitle={false} />
          </div>
          {teethLocations.length === 0 ? (
            <div className="flex justify-center items-center w-full text-muted-foreground">
              No treatment history. Click a tooth to add treatment history.
            </div>
          ) : (
            <ScrollArea className="h-[200px] w-full">
              <ToothHistoryCard edit={true} treatments={teethLocations} />
            </ScrollArea>
          )}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
            <Button type="button" onClick={() => onSubmit(form.getValues())}>
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
