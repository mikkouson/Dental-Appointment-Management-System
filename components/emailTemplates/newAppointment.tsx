import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface DentalAppointmentEmailProps {
  appointmentData: any;
}

export const DentalAppointmentEmail = ({
  appointmentData,
}: DentalAppointmentEmailProps) => {
  const previewText = `Your dental application has been approved.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-6">
          <Container className="border border-solid border-gray-300 rounded my-[40px] mx-auto p-[40px] max-w-[700px]">
            {/* Logo */}
            <Section className="text-center">
              <Img
                src={
                  "https://scontent.fpag2-1.fna.fbcdn.net/v/t39.30808-6/372982805_277309235049873_634404805512807765_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeF0OqUbhPySIINyy245U74LHEJ4EZGwXwMcQngRkbBfAz791wG9ovFGHs8totzlrR0Wgj8nf7BhdtJFQVWj4GPX&_nc_ohc=uYACGUPadNoQ7kNvgGLNcpa&_nc_ht=scontent.fpag2-1.fna&_nc_gid=AVzaZOWIEGZGzq4MDZ7e8n_&oh=00_AYDbWugqRee3QbhGTE9NwEO0v_O8D6Mb8jnuakjLyDmuIA&oe=670E691B"
                }
                width="150"
                height="150"
                alt="Vercel"
                className="my-0 mx-auto"
              />
            </Section>

            {/* Approval */}
            <Section className="text-center mt-[20px] mb-[20px]">
              <Heading className="text-[24px] font-semibold m-0">
                Your dental application has been approved.
              </Heading>
              <Text className="mt-2 text-gray-700 m-0">
                Please take note of your ticket number below:
              </Text>
              <Heading
                className="
    text-[28px] font-bold  mt-4 p-[20px] 
    bg-black/5 rounded-md mx-auto mb-[14px] 
    align-middle w-[280px]
  "
              >
                {appointmentData.appointment_ticket}
              </Heading>
            </Section>

            {/* Appointment Details */}
            <Hr className="border-gray-300 my-6" />
            <Section>
              <Text className="text-gray-700 font-semibold m-0 text-center">
                Appointment Request Details
              </Text>
              <Row className="flex justify-between mt-2">
                <Column className="flex-1">
                  <Text className="m-0 mr-[70px] font-bold">Name:</Text>
                </Column>
                <Column className="flex-1 text-right text-gray-500">
                  <Text className="m-0">{appointmentData.patients.name}</Text>
                </Column>
              </Row>

              <Row className="flex justify-between mt-2">
                <Column>
                  <Text className="m-0 mr-6 font-bold">Date of birth:</Text>
                </Column>
                <Column className="flex-1 text-right text-gray-500">
                  <Text className="m-0">{appointmentData.dob}</Text>
                </Column>
              </Row>

              <Row className="flex justify-between mt-2">
                <Column>
                  <Text className="m-0 mr-[74px] font-bold">Email:</Text>
                </Column>
                <Column className="flex-1 text-right text-gray-500">
                  <Text className="m-0">{appointmentData.patients.email}</Text>
                </Column>
              </Row>

              <Row className="flex justify-between mt-2">
                <Column>
                  <Text className="m-0 mr-2 font-bold">Phone Number:</Text>
                </Column>
                <Column className="flex-1 text-right text-gray-500">
                  <Text className="m-0">
                    {appointmentData.patients.phone_number}
                  </Text>
                </Column>
              </Row>

              <Row className="flex justify-between mt-2">
                <Column>
                  <Text className="m-0 mr-5 font-bold">Clinic Branch:</Text>
                </Column>
                <Column className="flex-1 text-right text-gray-500">
                  <Text className="m-0">{appointmentData.branch.name}</Text>
                </Column>
              </Row>

              <Row className="flex justify-between mt-2">
                <Column>
                  <Text className="m-0 mr-[79px] font-bold">Date:</Text>
                </Column>
                <Column className="flex-1 text-right text-gray-500">
                  <Text className="m-0">{appointmentData.date}</Text>
                </Column>
              </Row>

              <Row className="flex justify-between mt-2">
                <Column>
                  <Text className="m-0 mr-[77px] font-bold">Time:</Text>
                </Column>
                <Column className="flex-1 text-right text-gray-500">
                  <Text className="m-0">{appointmentData.time_slots.time}</Text>
                </Column>
              </Row>

              <Row className="flex justify-between mt-2">
                <Column>
                  <Text className="m-0 mr-8 font-bold">Request for:</Text>
                </Column>
                <Column className="flex-1 text-right text-gray-500">
                  <Text className="m-0">{appointmentData.services.name}</Text>
                </Column>
              </Row>
            </Section>

            {/* Manage Appointment Button */}
            <Section className="text-center mt-8">
              <Text className="text-gray-500 text-sm m-0">
                IMPORTANT REMINDER: Please come one hour before the scheduled
                time.
              </Text>
              <Button
                className="bg-blue-600 rounded text-white text-[14px] font-semibold no-underline text-center px-5 py-3 mt-4"
                href="#"
              >
                Manage Appointment
              </Button>
            </Section>

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

export default DentalAppointmentEmail;
