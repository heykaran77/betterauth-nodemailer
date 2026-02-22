import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Tailwind,
} from '@react-email/components';

const AccountVerificationEmail = ({
  userName,
  verificationLink,
}: {
  userName: string;
  verificationLink: string;
}) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white max-w-[600px] mx-auto px-[40px] py-[32px]">
            <Section>
              <Text className="text-[32px] font-bold text-gray-900 mb-[24px] mt-0">
                Verify Your Account
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[24px] mt-0">
                Hello {userName},
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[24px] mt-0">
                Thank you for signing up! To complete your registration and
                secure your account, please verify your email address by
                clicking the button below.
              </Text>

              <Section className="text-center mb-[32px]">
                <Button
                  href={verificationLink}
                  className="bg-blue-600 text-white px-[32px] py-[12px] rounded-[8px] text-[16px] font-medium text-decoration-none box-border">
                  Verify My Account
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[24px] mt-0">
                If the button above doesn&apos;t work, you can also copy and
                paste the following link into your browser:
              </Text>

              <Text className="text-[14px] text-blue-600 mb-[32px] mt-0 break-all">
                {verificationLink}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AccountVerificationEmail;
