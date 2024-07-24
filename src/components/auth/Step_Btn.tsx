import { Button } from "../ui/button";
import { FaArrowRightLong, FaArrowLeft } from "react-icons/fa6";

interface Props {
  prev: () => void;
  next: () => void;
  disabled?: boolean;
  currentStep: number;
  reset: () => void; // เพิ่ม function สำหรับรีเซ็ต
}

const Step_Btn: React.FC<Props> = ({
  prev,
  next,
  disabled,
  currentStep,
  reset,
}) => {
  return (
    <>
      {currentStep !== 4 && currentStep !== 5 ? (
        <div className="flex w-full justify-between p-3">
          <Button variant={"ghost"} onClick={prev} disabled={currentStep === 0}>
            <FaArrowLeft size={50} />
          </Button>
          {currentStep !== 3 && (
            <Button onClick={next} disabled={disabled} variant={"ghost"}>
              <FaArrowRightLong size={50} />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex w-full justify-between p-3">
          {currentStep !== 4 && (
            <Button
              variant={"ghost"}
              className="animate-bounce text-lg text-white"
              onClick={reset}
            >
              Sign-up again
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default Step_Btn;
