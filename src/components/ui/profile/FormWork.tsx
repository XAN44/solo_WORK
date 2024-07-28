"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { StartWorkSchema } from "../../../../schema/validateStartWork";
import { z } from "zod";
import { typeOfWork } from "@prisma/client";
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

export default function FormWork() {
  const form = useForm<z.infer<typeof StartWorkSchema>>({
    resolver: zodResolver(StartWorkSchema),
    defaultValues: {
      title: "",
      description: "",
      typeOfWork: typeOfWork.WorkFormOffice,
      startAt: undefined,
      endAt: undefined,
    },
    mode: "onChange",
  });

  const [buttonText, setButtonText] = useState("Start Work");
  //   TODO ตรวจสอบเวลา
  const startAt = form.watch("startAt");

  useEffect(() => {
    // TODO : เก็บเวลา ณ ปัจจุบัน
    const now = startOfDay(new Date());

    if (startAt) {
      // TODO : เก็บตัวแปรที่ผู้ใช้เลือก
      const startAtDate = startOfDay(new Date(startAt));
      //   TODO : ถ้าตัวแปรที่ผู้ใช้เลือกมีค่าน้อยกว่าเวลาปัจจุบัน จะคืนค่ากลับไปว่า Belated sign
      if (startAtDate.getTime() < now.getTime()) {
        setButtonText("Belated Sign");
      } else {
        setButtonText("Start Work");
      }
    } else {
      setButtonText("Start Work");
    }
  }, [startAt]);

  const [isPending, startTransition] = useTransition();

  const onSubmit = (value: z.infer<typeof StartWorkSchema>) => {
    startTransition(() => {
      StartWorkAction(value).then((data) => {
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
        <h1 className="p-10 text-xl font-bold md:p-3">Create Task</h1>
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
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your title task"
                      className="w-64"
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter your description"
                      className="w-64"
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col space-y-3 pt-3 md:flex-row md:space-x-3 md:space-y-0">
              <FormField
                control={form.control}
                name="startAt"
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
                    <FormDescription>Choose a start date</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endAt"
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
                      Select date time expected to be finished
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="typeOfWork"
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
                      <SelectItem value={typeOfWork.WorkFormHome}>
                        Work Form Home
                      </SelectItem>
                      <SelectItem value={typeOfWork.WorkFormOffice}>
                        Work Form Office
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the work type</FormDescription>
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
