"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Cardwarpper from "../ui/cardwarpper/cardwarpper";
import { BeatLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "../../../action/new-Verification";
import FormError from "../ui/Form-Error";
import FormSuccess from "../ui/Form-success";
import clsx from "clsx";
import { MdOutlineDomainVerification } from "react-icons/md";
import { MdErrorOutline } from "react-icons/md";

const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [colorSuccess, setColorSuccess] = useState("");
  const [colorError, setColorError] = useState("");
  const router = useRouter();

  const onSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("Missing Token");
      return;
    }
    newVerification(token)
      .then((data) => {
        if (data.success) {
          setSuccess(data.success);
          setColorSuccess("bg-gradient-to-b from-violet-600 to-indigo-600");
          router.push("/auth/sign-in");
          setError(""); // Clear error if success
          setColorError("bg-gradient-to-b from-violet-600 to-indigo-600");
        }
        if (data.error) {
          setError(data.error);
          setColorError("bg-gradient-to-b from-red-700 to-rose-900");
          setSuccess(""); // Clear success if error
        }
      })
      .catch(() => {
        setError("Somthing went wrong");
        setSuccess(""); // Clear success if error
        setColorError("bg-gradient-to-b from-red-700 to-rose-900");
      });
  }, [token, success, error, router]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  const bg1 = clsx({
    "bg-gradient-to-b from-violet-600 to-indigo-600/100": !success && !error,
    "bg-gradient-to-b from-violet-600 to-indigo-600": success,
    "bg-gradient-to-b from-red-700 to-rose-900": error,
  });

  return (
    <Cardwarpper
      color=""
      bar_sub="back to sign-in"
      href="/auth/sign-in"
      bar_title="Verification"
      bar_content=""
      bg2="bg-white"
      bg1={bg1}
    >
      <div
        className={clsx(
          "flex h-full w-full flex-col items-center justify-center space-y-6",
        )}
      >
        {!success && !error && (
          <div className="flex flex-col items-center justify-center text-center">
            <h1>
              Verifying accuracy If successful, it will take you back to the
              login page.
            </h1>
            <BeatLoader />
          </div>
        )}
        {success && (
          <div
            className={clsx(
              "flex h-full w-full items-center justify-center text-lg font-bold text-white",
              colorSuccess,
            )}
          >
            <div className="flex flex-col items-center justify-center space-y-6">
              <MdOutlineDomainVerification className="h-36 w-36" />
              <p>{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div
            className={clsx(
              "flex h-full w-full items-center justify-center font-bold text-white",
              colorError,
            )}
          >
            <div className="flex flex-col items-center justify-center space-y-6">
              <MdErrorOutline className="h-36 w-36" />
              <p>{error}</p>
            </div>
          </div>
        )}
      </div>
    </Cardwarpper>
  );
};

export default NewVerificationForm;
