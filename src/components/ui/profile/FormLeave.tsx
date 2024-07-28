"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { StartWorkSchema } from "../../../../schema/validateStartWork";
import { z } from "zod";
import { Attendance, TypeLeave, typeOfWork } from "@prisma/client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { DateTimePicker } from "../date-time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Button } from "../button";
import { useEffect, useState, useTransition } from "react";
import { isBefore, startOfDay } from "date-fns";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { MdError } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { ClipLoader } from "react-spinners";
import { StartWorkAction } from "../../../../action/create-task";
import { StartLeaveRequest } from "../../../../schema/validateLeaveRequest";
import { StartLeaveRequestAtion } from "../../../../action/create-LeaveRequest";
import { TypeLeaveSelect } from "../../../lib/typeLeave";
import { useRouter } from "next/navigation";

export default function FormLeave() {
  const form = useForm<z.infer<typeof StartLeaveRequest>>({
    resolver: zodResolver(StartLeaveRequest),
    defaultValues: {
      title: "",
      reason: "",
      dateIn: undefined,
      dateOut: undefined,
      typeLeave: TypeLeave.PERSONAL,
      tel: "",
    },
    mode: "onChange",
  });

  const router = useRouter();

  const [buttonText, setButtonText] = useState("Send Leave request");
  //   TODO ตรวจสอบเวลา

  const [isPending, startTransition] = useTransition();

  const onSubmit = (value: z.infer<typeof StartLeaveRequest>) => {
    startTransition(() => {
      StartLeaveRequestAtion(value).then((data) => {
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
      <div className="flex items-start justify-start">
        <div className="flex items-end justify-center p-10 text-xl font-bold md:p-3">
          <h1> LeaveRequest</h1>
          <p className="text-xs text-red-800">(แจ้งล่วงหน้า 15 วัน)</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-3 text-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title Leave</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your title task"
                      className="w-64"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter your description"
                      className="w-64"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tel</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your title task"
                      className="w-64"
                    />
                  </FormControl>
                  <FormDescription> contact number</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-center justify-center space-y-3 pt-3 md:flex-row md:space-x-3 md:space-y-0">
              <FormField
                control={form.control}
                name="dateIn"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start At</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Pick a date time"
                      />
                    </FormControl>
                    <FormDescription>
                      Select the start date and time.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOut"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End At</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Pick a date time"
                      />
                    </FormControl>
                    <FormDescription>
                      Select the end date and time.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="typeLeave"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Type of leave</FormLabel>
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
                      {TypeLeaveSelect.map((v, i) => (
                        <SelectItem key={v.value} value={v.value}>
                          {v.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-6">
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
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
