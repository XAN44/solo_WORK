"use client";
import React, { startTransition, useState, useTransition } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";

import { StatusTask, UserLevel } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { StatusWorkSchema } from "../../../../schema/validateStatusWork";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { SelectStatusWork } from "../../../lib/selectTaskStatus";
import { UpdateStatusTask } from "../../../../action/update-StatusTask";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { MdError } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { ClipLoader } from "react-spinners";

interface Model {
  id: string;
}

export default function ActionBtn_AllTask({ id }: Model) {
  const [buttonText, setButtonText] = useState("Submit");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof StatusWorkSchema>>({
    resolver: zodResolver(StatusWorkSchema),
    defaultValues: {
      status: "InProgress",
      id: id,
    },
  });

  const onSubmit = (value: z.infer<typeof StatusWorkSchema>) => {
    startTransition(() => {
      UpdateStatusTask(value).then((data) => {
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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Work status</h4>
            <p className="text-sm text-muted-foreground">
              Choose the work status of your team members.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Status task to member</FormLabel>
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
                        {SelectStatusWork.map((d) => (
                          <SelectItem key={d.value} value={d.value}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <div className="mt-7">
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
      </PopoverContent>
    </Popover>
  );
}
