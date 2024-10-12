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

export const DentalAppointmentCancellationEmail = () => {
  const previewText = `Your dental appointment has been canceled.`;

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
                alt="Lobo Dental"
                className="my-0 mx-auto"
              />
            </Section>

            {/* Cancellation Message */}
            <Section className="text-center mt-[20px] mb-[20px]">
              <Heading className="text-[24px] font-semibold mb-[20px] text-red-600">
                Your dental appointment has been canceled.
              </Heading>
              <Text className="mt-2 text-gray-700 m-0">
                Unfortunately, your appointment has been canceled.
              </Text>
              <Text className="mt-4 text-gray-700 m-0">
                If you have any questions or would like to reschedule, please
                contact us via
                <Link
                  href="mailto:lobodent.appointment.system@gmail.com"
                  className="text-blue-600 underline"
                >
                  {" "}
                  Email
                </Link>{" "}
                or message us on{" "}
                <Link
                  href="https://www.facebook.com/Lobodental1127"
                  className="text-blue-600 underline"
                >
                  Facebook
                </Link>
                .
              </Text>
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

export default DentalAppointmentCancellationEmail;
