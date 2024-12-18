import { ToothHistory } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, MoreHorizontal, MoreVertical } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DeleteToothHistory } from "../modal/patients/deleteToothHistory";
import { EditToothCondition } from "../modal/patients/edit-tooth-condition";
import { useConditionColors } from "../tooth-colors";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { getToothDescription } from "../ui/tooth-description";

interface Treatment {
  id?: any;
  history_date: Date;
  tooth_location: number;
  tooth_condition: string;
  tooth_history: string;
  patient_id?: number;
  appointments?: {
    services?: {
      name: string;
    };
  };
}

interface ToothHistoryProps {
  treatments: Treatment[];
  edit?: boolean;
  newPatient?: boolean;
  showDropDown?: boolean;
}

type SortOrder = "asc" | "desc";

export default function ToothHistoryCard({
  treatments,
  edit = false,
  newPatient = false,
  showDropDown = true,
}: ToothHistoryProps) {
  const conditionColors = useConditionColors();

  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const form = useForm<z.infer<typeof ToothHistory>>({
    resolver: zodResolver(ToothHistory),
  });
  const sortedTreatments = [...treatments].sort(
    (a: Treatment, b: Treatment) => {
      try {
        const dateA = new Date(a.history_date);
        const dateB = new Date(b.history_date);

        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          throw new Error("Invalid date");
        }

        return sortOrder === "desc"
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime();
      } catch (error) {
        console.error("Date sorting error:", error);
        return 0;
      }
    }
  );

  const toggleSort = () => {
    setSortOrder((current) => (current === "desc" ? "asc" : "desc"));
  };

  const formatDate = (date: string) => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        throw new Error("Invalid date");
      }
      return {
        day: d.getDate(),
        month: d.toLocaleString("default", { month: "short" }),
        year: d.getFullYear(),
      };
    } catch (error) {
      console.error("Date formatting error:", error);
      return { day: "--", month: "---", year: "----" };
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="mb-4 flex justify-end">
        {!edit && (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSort}
            className="flex items-center gap-2"
          >
            <span>
              {sortOrder === "desc" ? "Newest First" : "Oldest First"}
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                sortOrder === "asc" ? "rotate-180" : ""
              }`}
            />
          </Button>
        )}
      </div>
      <ScrollArea className={cn("bg-transparent w-full", !edit && "h-[395px]")}>
        <div className="space-y-6">
          {sortedTreatments.map((treatment, index) => {
            const date = formatDate(treatment.history_date.toString());
            const toothDescription = getToothDescription(
              treatment.tooth_location
            );

            return (
              <div
                key={`treatment-${treatment.tooth_location}-${index}`}
                className="flex group"
              >
                <div className="flex flex-col items-center mr-4">
                  <div className="rounded-full h-3 w-3 bg-primary group-hover:scale-110 transition-transform" />
                  {index < sortedTreatments.length - 1 && (
                    <div className="h-full w-0.5 bg-border mt-1" />
                  )}
                </div>

                <Card className="flex-grow hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex justify-between">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-semibold">
                            {date.day}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {date.month}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {date.year}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h3 className="font-medium text-sm">
                            <span>
                              Tooth Number: {treatment.tooth_location}
                            </span>
                          </h3>
                          <p className="text-sm text-muted-foreground italic">
                            {toothDescription.charAt(0).toUpperCase() +
                              toothDescription.slice(1)}
                          </p>
                          <Badge
                            variant="outline"
                            className="mb-2"
                            style={{
                              backgroundColor:
                                conditionColors[
                                  treatment.tooth_condition as keyof typeof conditionColors
                                ],
                            }}
                          >
                            {treatment.tooth_condition}
                          </Badge>

                          {treatment?.appointments?.services && (
                            <div className="flex gap-2">
                              <h3 className="font-medium text-sm">Service:</h3>
                              <p className="text-sm text-muted-foreground">
                                {treatment?.appointments?.services?.name}
                              </p>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <h3 className="font-medium text-sm">
                              Description:
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {treatment.tooth_history}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {showDropDown && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <EditToothCondition
                            treatment={treatment}
                            form={form}
                            newPatient={newPatient}
                          />
                          {/* <DropdownMenuItem>View Details</DropdownMenuItem> */}
                          <DropdownMenuSeparator />
                          {/* <DropdownMenuItem className="text-destructive">
                         Delete
                       </DropdownMenuItem> */}
                          <DeleteToothHistory
                            id={treatment?.id}
                            form={form}
                            newPatient={newPatient}
                            location={treatment.tooth_location}
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
