"use client";
// TODO: Form Sign-in
export const maxDuration = 60; // This function can run for a maximum of 5 seconds

import React, { startTransition, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SignInSchema } from "../../../schema/validatSign";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "../ui/Form-Error";
import FormSuccess from "../ui/Form-success";
import { LoginAction } from "../../../action/login";
import Link from "next/link";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { MdError } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { ClipLoader } from "react-spinners";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Form_LOGIN() {
  const [isPending, startTranstion] = useTransition();
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  const [buttonText, setButtonText] = useState("Sign-In");
  const onSubmit = (value: z.infer<typeof SignInSchema>) => {
    startTransition(() => {
      LoginAction(value).then((data) => {
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
    <div className="h-full w-full">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="HelloExample"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="******"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Link href="/auth/reset" className="text-sm">
              Forgot Password ?
            </Link>
            <div className="flex flex-col">
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button
                disabled={!isDirty || !isValid || isPending}
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
    </div>
  );
}
