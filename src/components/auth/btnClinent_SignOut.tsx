"use client";
import { signOut } from "next-auth/react";

const Btn_signOut = () => {
  return (
    <button
      className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
      onClick={() => signOut()}
    >
      Sign Out
    </button>
  );
};

export default Btn_signOut;
