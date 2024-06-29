import * as React from 'react';
import { Html, Text, Head, Font, Preview, Section, Heading, Row } from "@react-email/components";

export function VerificationMail({ userName, verifyCode }: { userName: string; verifyCode: string }) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here`&apos;`s your verification code: {verifyCode}</Preview>
      <Section style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        <Row style={{ textAlign: 'center' }}>
          <Heading as="h2" style={{ color: '#4CAF50', margin: '20px 0' }}>Hello {userName},</Heading>
        </Row>
        <Row style={{ textAlign: 'center' }}>
          <Text style={{ fontSize: '16px', color: '#555', margin: '10px 0' }}>
            Thank you for registering. Please use the following verification code to complete your registration:
          </Text>
        </Row>
        <Row style={{ textAlign: 'center', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', margin: '20px 0' }}>
          <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{verifyCode}</Text>
        </Row>
        <Row style={{ textAlign: 'center' }}>
          <Text style={{ fontSize: '14px', color: '#888', margin: '20px 0' }}>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}