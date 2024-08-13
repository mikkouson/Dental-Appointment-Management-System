import { CalendarDemo } from "@/components/Calendar";

export default function Admin() {
  // const [date, setDate] = React.useState<Date | undefined>(new Date());
  // const [statuses, setStatuses] = React.useState<string[]>([]); // Array to hold selected statuses
  // console.log(statuses);
  // const currentDate = moment(date).format("MM/DD/YYYY");

  // const handleCheckboxChange = (status: string, checked: boolean) => {
  //   setStatuses((prevStatuses) => {
  //     if (checked) {
  //       // Add the status to the array if checked
  //       return [...prevStatuses, status];
  //     } else {
  //       // Remove the status from the array if unchecked
  //       return prevStatuses.filter((s) => s !== status);
  //     }
  //   });
  // };

  return (
    <>
      <CalendarDemo />
    </>
  );
}
