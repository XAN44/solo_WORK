export const maxDuration = 60; // This function can run for a maximum of 5 seconds

import React from "react";
import NewPasswordForm from "../../../components/auth/form_NewPassword";
import Cardwarpper from "../../../components/ui/cardwarpper/cardwarpper";

export default function page() {
  return (
    <Cardwarpper
      bar_content="Enter your new password "
      bar_title="New password! "
      bar_sub="Back to sing-in"
      href="/auth/sign-in"
      color=""
      bg2=" bg-white"
      bg1="bg-gradient-to-b from-violet-600 to-indigo-600"
    >
      <NewPasswordForm />;
    </Cardwarpper>
  );
}
