import React from "react";
import { MdErrorOutline } from "react-icons/md";

interface FormSuccessProps {
  message?: string;
}

export default function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null;

  return (
    <div className="flex items-center justify-start gap-x-2 rounded-md bg-emerald-500/15 p-3 text-emerald-500">
      <MdErrorOutline className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
}
