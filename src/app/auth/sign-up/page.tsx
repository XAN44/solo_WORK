"use client";

import { useState } from "react";
import Cardwarpper from "../../../components/ui/cardwarpper/cardwarpper";
import Form_Register from "../../../components/auth/form_Register";
import Step_Btn from "../../../components/auth/Step_Btn";
import { SignUpSchema } from "../../../../schema/validatSign";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { stepPage } from "../../../lib/step";
import { z } from "zod";

const Page: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const step = stepPage;

  type inputs = z.infer<typeof SignUpSchema>;

  type FieldName = keyof inputs;
  const next = async () => {
    if (currentStep < step.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };
  //TODO: ถ้าอยู่ที่ขั้นตอนสุดท้ายจะ disable ปุ่ม Next
  const isNextDisabled = currentStep === step.length - 1;

  const handleSuccess = () => {
    setCurrentStep(4);
  };

  const handleError = () => {
    setCurrentStep(5);
  };

  const reset = () => {
    setCurrentStep(0);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <Cardwarpper
        bg2={step[currentStep].bg1 || ""}
        bg1={step[currentStep].bg || " "}
        color={step[currentStep].color || ""}
        bar_title={step[currentStep].id}
        bar_content={step[currentStep].bar_content || ""}
        bar_sub={step[currentStep].btn_content || ""}
        href={step[currentStep].href || ""}
      >
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Form_Register
            currentStep={currentStep}
            onSuccess={handleSuccess}
            onError={handleError}
          />
          <Step_Btn
            next={next}
            prev={prev}
            currentStep={currentStep}
            disabled={isNextDisabled}
            reset={reset}
          />
        </div>
      </Cardwarpper>
    </div>
  );
};

export default Page;
