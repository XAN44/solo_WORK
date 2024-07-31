"use client";
export const maxDuration = 60; // This function can run for a maximum of 5 seconds

import React from "react";
import { Button } from "../../../components/ui/button";
import Cardwarpper from "../../../components/ui/cardwarpper/cardwarpper";
import Form_LOGIN from "../../../components/auth/form_Login";

export default function page() {
  return (
    // *ปรับแต่งหัวข้อได้ในหน้านี้ หรือหากต้องการอยากจะแก้ไขตัว UI ทั้งหมด Ctrl + Click ไปที่ Cardwarpper
    <Cardwarpper
      bar_content="if you don't have account "
      bar_title="Sign-In "
      bar_sub="REGISTER"
      href="/auth/sign-up"
      color=""
      bg2=" bg-white"
      bg1="bg-gradient-to-b from-violet-600 to-indigo-600"
    >
      <Form_LOGIN />
    </Cardwarpper>
  );
}
