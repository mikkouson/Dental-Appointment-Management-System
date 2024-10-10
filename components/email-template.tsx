import * as React from "react";

interface EmailTemplateProps {
  appointmentTicket: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  appointmentTicket,
}) => (
  <div>
    <h1>Welcome, {appointmentTicket}!</h1>
  </div>
);

export default EmailTemplate;
