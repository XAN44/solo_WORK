"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AccumulationSettingsSchema } from "../../../../schema/validateSalary";
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
import { Button } from "../button";
import { useEffect, useState, useTransition } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { MdError } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { ClipLoader } from "react-spinners";
import { UpdateSalary } from "../../../../action/update-salary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

export default function FormConfigSalary() {
  const form = useForm<z.infer<typeof AccumulationSettingsSchema>>({
    resolver: zodResolver(AccumulationSettingsSchema),
    defaultValues: {
      typeOfWork: "WorkFormHome",
      amount: 0,
    },
    mode: "onChange",
  });

  const [buttonText, setButtonText] = useState("Save Settings");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (value: z.infer<typeof AccumulationSettingsSchema>) => {
    startTransition(() => {
      UpdateSalary(value).then((data) => {
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
        <h1 className="p-10 text-xl font-bold md:p-3">
          Configure Salary Settings
        </h1>
      </div>
      <div className="flex items-center justify-center p-3 text-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center space-y-8"
          >
            <FormField
              control={form.control}
              name="typeOfWork"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Type of Work</FormLabel>
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
                        Work From Home
                      </SelectItem>
                      <SelectItem value={typeOfWork.WorkFormOffice}>
                        Work From Office
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select work type</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the amount for the selected type of work.
                  </FormDescription>
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
