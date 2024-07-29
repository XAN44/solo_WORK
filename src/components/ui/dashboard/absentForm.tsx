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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

export default function AbsentForm() {
  const form = useForm<z.infer<typeof AccumulationSettingsSchema>>({
    resolver: zodResolver(AccumulationSettingsSchema),
    defaultValues: {
      typeOfWork: "WorkFormHome",
      amount: 0,
    },
    mode: "onChange",
  });

  const [buttonText, setButtonText] = useState("Start check");
  const [isPending, startTransition] = useTransition();
  const [absentMembers, setAbsentMembers] = useState<
    { id: string; name: string }[]
  >([]);

  const onSubmit = async (data: z.infer<typeof AccumulationSettingsSchema>) => {
    // Handle form submission here
  };

  return (
    <>
      <div className="flex items-start justify-start">
        <h1 className="p-10 text-xl font-bold md:p-3">Check member in team</h1>
      </div>
      <div className="flex items-center justify-center p-3 text-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center space-y-8"
          >
            <div className="flex flex-col space-y-4">
              {absentMembers.length > 0 ? (
                <FormItem>
                  <FormLabel>Absent Members</FormLabel>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {absentMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              ) : (
                <p>No absent members today.</p>
              )}
            </div>
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
