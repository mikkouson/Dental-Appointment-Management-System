import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  Img,
} from "@react-email/components";
import * as React from "react";

export const RejectReschedule = () => {
  const previewText = `Your reschedule request has been rejected, but your appointment remains accepted.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#f6f9fc] my-auto mx-auto font-sans px-6">
          <Container className="shadow-md bg-[#ffffff] rounded-md my-[40px] mx-auto p-[40px] max-w-[700px]">
            {/* Logo */}
            <Section className="text-center">
              <Img
                src={
                  "https://github.com/mikkouson/Dental-Appointment-Management-System/blob/75d8939fe58bae5375fbe42938fd088c07b5e7e2/public/lobodent.jpeg?raw=true"
                }
                width="150"
                height="70"
                alt="Company Logo"
                className="my-0 mx-auto"
              />
            </Section>

            {/* Reschedule Rejection Message */}
            <Section className="text-center mt-[20px] mb-[20px]">
              <Heading className="text-[24px] font-semibold mb-[20px] text-red-600">
                Your reschedule request has been rejected!
              </Heading>
              <Text className="mt-2 text-gray-700 m-0">
                We regret to inform you that your request to reschedule your
                appointment has been rejected. However, your current appointment
                remains accepted.
              </Text>
              <Text className="mt-4 text-gray-700 m-0">
                If you no longer wish to keep your appointment, you can cancel
                it by visiting the link below:
              </Text>
              <Section className="text-center mt-[10px]">
                <Link
                  href="https://www.lobodentdentalclinic.online/appointment/view"
                  className="text-blue-600 underline font-semibold"
                >
                  Cancel Appointment
                </Link>
              </Section>
            </Section>

            {/* Footer */}
            <Hr className="border-gray-300 my-6" />
            <Text className="text-gray-500 text-xs text-center m-0">
              *This is an automatically generated email* DO NOT REPLY
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default RejectReschedule;
