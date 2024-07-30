import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { MdError } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";

import { TimeOutWorkSchema } from "../../../../schema/validateStatusWork";
import { UpdateTimeOut } from "../../../../action/create-timeOut";
import { Button } from "../button";
import { Form } from "../form";
import ConfirmModal from "./confirmSignOut";

interface Model {
  id: string;
}

export default function ActionBtn_TimeOut({ id }: Model) {
  const [buttonText, setButtonText] = useState("Check Out");
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setModalOpen] = useState(false);

  const form = useForm<z.infer<typeof TimeOutWorkSchema>>({
    resolver: zodResolver(TimeOutWorkSchema),
    defaultValues: {
      id: id,
      dateOut: new Date(),
    },
  });

  const onSubmit = (value: z.infer<typeof TimeOutWorkSchema>) => {
    setModalOpen(true);
  };

  const handleConfirm = () => {
    setModalOpen(false);
    startTransition(() => {
      UpdateTimeOut(form.getValues()).then((data) => {
        const isError = !!data?.error;
        toast.custom(
          (t) => (
            <AnimatePresence>
              <motion.div
                key=""
                layout
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 1 }}
                className={`flex items-center justify-center rounded-md ${isError ? "bg-destructive" : "bg-emerald-700"} px-6 py-4 text-white shadow-md ${t.visible ? "animate-in" : "animate-out"} `}
              >
                {isError ? (
                  <>
                    {data.error}
                    <MdError className="h-6 w-6 text-white" />
                  </>
                ) : (
                  <>
                    {data?.success}
                    <GiConfirmed className="h-6 w-6" />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          ),
          {
            duration: 4000,
          },
        );
      });
    });
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Button
            disabled={isPending}
            type="submit"
            className="bg-black text-white"
          >
            {isPending ? <ClipLoader size={24} color="#ffffff" /> : buttonText}
          </Button>
        </form>
      </Form>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}
