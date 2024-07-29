"use client";
import React, { startTransition, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdError } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";

import { ClipLoader } from "react-spinners";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { ApproveRequestSchema } from "../../../../schema/validateLeaveRequest";
import { useForm } from "react-hook-form";
import { ApproveLeaveRequest } from "../../../../action/create-approveRequest";
import { format } from "date-fns";
import { Badge } from "../badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Button } from "../button";
import { SelectApprove } from "../../../lib/typeLeave";
import LevelGate from "../../../app/auth/Level-Gate";
import { useCurrentLevel } from "../../../../hooks/use-curret-user";

interface Model {
  id: string;
  title: string;
  reason: string;
  tel: string;
  leaveDateStart: Date;
  leaveDateEnd: Date;
  username: string;
  typeleave: string;
  first_name: string;
  last_name: string;
  status: string;
}
export default function FormApprove({
  id,
  title,
  leaveDateEnd,
  leaveDateStart,
  typeleave,
  reason,
  tel,
  username,
  first_name,
  last_name,
  status,
}: Model) {
  const [buttonText, setButtonText] = useState("Submit");
  const [isPending, startTransition] = useTransition();
  const session = useCurrentLevel();
  const form = useForm<z.infer<typeof ApproveRequestSchema>>({
    resolver: zodResolver(ApproveRequestSchema),
    defaultValues: {
      statusLeave: "PENDING",
      id: id,
    },
  });
  const onSubmit = (value: z.infer<typeof ApproveRequestSchema>) => {
    startTransition(() => {
      ApproveLeaveRequest(value).then((data) => {
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

  return (
    <>
      <div className="flex items-center justify-between p-3">
        <h1 className="p-10 text-xl font-bold md:p-3">Approve leave request</h1>
        <Badge>status {status}</Badge>
      </div>
      <div className="flex items-center justify-center p-3 text-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center space-y-8"
          >
            <div className="flex items-start justify-between space-x-10 text-start">
              <h1>{first_name}</h1>
              <h1>{last_name}</h1>
            </div>
            <div className="flex flex-col items-start justify-between">
              <div className="">
                <h1>Title leave: {title}</h1>
                <h1>Reason: {reason}</h1>
                <h1>Type of leave: {typeleave}</h1>
                <h1>Contact Tel: {tel}</h1>
                <h1>
                  Leave Start Date:{" "}
                  {format(leaveDateStart, "dd MMMM yyyy, HH:mm")}
                </h1>
                <h1>
                  Leave End Date: {format(leaveDateEnd, "dd MMMM yyyy, HH:mm")}
                </h1>
              </div>
            </div>
            <div className="flex flex-col items-start justify-between">
              <FormField
                name="statusLeave"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Type of work</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SelectApprove.map((d) => (
                          <SelectItem key={d.value} value={d.value}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select Approved or Rejected
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {session === "Supervisor" || session === "Admin" ? (
              <Button
                disabled={isPending}
                type="submit"
                className="bg-black text-white"
              >
                {isPending ? (
                  <ClipLoader size={24} color="#ffffff" />
                ) : (
                  buttonText
                )}
              </Button>
            ) : null}
          </form>
        </Form>
      </div>
    </>
  );
}
