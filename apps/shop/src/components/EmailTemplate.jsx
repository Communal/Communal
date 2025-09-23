import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
} from "@react-email/components";

export default function ResetPasswordEmail({ resetLink, userEmail }) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password for Communalone</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Text style={logo}>Communalone</Text>
          </Section>

          <Section style={content}>
            <Text style={heading}>Password Reset Request</Text>
            <Text style={paragraph}>
              Hi {userEmail}, we received a request to reset your password.
            </Text>
            <Text style={paragraph}>
              Click the button below to reset your password. This link will
              expire in 1 hour.
            </Text>
            <Button
              style={button}
              href={resetLink}
            >
              Reset Password
            </Button>
            <Text style={paragraph}>
              If you didn’t request this, you can safely ignore this email.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} Communalone. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "Arial, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const logoContainer = {
  textAlign: "center",
  marginBottom: "20px",
};

const logo = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#ff6600",
};

const content = {
  padding: "10px 20px",
};

const heading = {
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "10px",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "20px",
  marginBottom: "20px",
  color: "#333333",
};

const button = {
  backgroundColor: "#ff6600",
  color: "#ffffff",
  padding: "12px 20px",
  borderRadius: "5px",
  textDecoration: "none",
  display: "inline-block",
  fontWeight: "bold",
};

const footer = {
  marginTop: "30px",
  textAlign: "center",
};

const footerText = {
  fontSize: "12px",
  color: "#888888",
};
