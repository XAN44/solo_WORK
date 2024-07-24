import React from "react";
import ResetForm from "../../../components/auth/form_Reset";
import Cardwarpper from "../../../components/ui/cardwarpper/cardwarpper";

export default function page() {
  return (
    <Cardwarpper
      bar_content="Forgot your password ? "
      bar_title="Enter your email "
      bar_sub="Back to sing-in"
      href="/auth/sign-in"
      color=""
      bg2=" bg-white"
      bg1="bg-gradient-to-b from-violet-600 to-indigo-600"
    >
      <ResetForm />;
    </Cardwarpper>
  );
}
