import { ActionIcon, Container, Stepper } from '@mantine/core';
import { ArrowLeftIcon } from '@modulz/radix-icons';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Seo } from '@/components/seo';
import { ForgotPasswordForm, ResetPasswordForm, ConfirmationCodeForm } from '@/components/forms';

const ForgotPassword = () => {
  const router = useRouter();
  const [active, setActive] = useState(0);

  const [forgotdata, setForgotData] = useState({});
  const [resetAllData, setAllResetData] = useState({});

  const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <>
      <Seo title="password reset" description="Best LMS" path="signin" />
      <Container>
        <ActionIcon
          id="btn-forgotPasswordBack"
          title="Go Back"
          onClick={active === 0 ? () => router.replace('/signin') : prevStep}
          variant="hover"
          sx={{ position: 'absolute', top: 40, zIndex: 2 }}
        >
          <ArrowLeftIcon className="rtl" width={100} height={100} />
        </ActionIcon>

        <Stepper
          onStepClick={setActive}
          active={active}
          //style = {{backgroundColor : 'red'}}
          styles={{
            steps: {
              display: 'none',
            },
          }}
        >
          <Stepper.Step>
            <ForgotPasswordForm nextStep={nextStep} setForgotData={setForgotData} />
          </Stepper.Step>

          <Stepper.Step>
            <ConfirmationCodeForm
              nextStep={nextStep}
              verifydata={forgotdata}
              setAllResetData={setAllResetData}
            />
          </Stepper.Step>

          <Stepper.Completed>
            <ResetPasswordForm reset={resetAllData} />
          </Stepper.Completed>
        </Stepper>
      </Container>
    </>
  );
};

export default ForgotPassword;
