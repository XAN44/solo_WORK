export const maxDuration = 60; // This function can run for a maximum of 5 seconds

import Image from "next/image";
import React from "react";
import NewVerificationForm from "../../../components/auth/new-verificationForm";

export default function page() {
  return (
    <div>
      <NewVerificationForm />
    </div>
  );
}
