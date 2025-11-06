import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
export const VerifyEmail = ({ url }: { url: string }) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Verify your email address</Preview>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src={`${baseUrl}/logo.png`}
            width="120"
            height="36"
            alt="StuDine"
          />
        </Section>
        <Heading style={h1}>Verify your email address</Heading>
        <Text style={heroText}>
          Click the button below to verify your email address.
        </Text>
        <Button style={button} href={url}>Verify email</Button>

        <Text style={text}>
          If you didn't request this email, there's nothing to worry about, you
          can safely ignore it.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default VerifyEmail;


const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "0px 20px",
};

const logoContainer = {
  marginTop: "32px",
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "36px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px",
};

const heroText = {
  fontSize: "20px",
  lineHeight: "28px",
  marginBottom: "30px",
};

const button = {
  backgroundColor: "#1e9df1",
  color: "#ffffff",
  fontSize: "14px",
  lineHeight: "24px",
  padding: "10px 20px",
  borderRadius: "5px",
};

const text = {
  color: "#000",
  fontSize: "14px",
  lineHeight: "24px",
};
