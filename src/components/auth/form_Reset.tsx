"use client";
// TODO: Form Sign-in
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ResetSchema, SignInSchema } from "../../../schema/validatSign";
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

import { reset } from "../../../action/reset";

export default function ResetForm() {
  const [isPending, startTranstion] = useTransition();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (value: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");
    startTranstion(() => {
      reset(value).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="example@mail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col">
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button type="submit" variant={"default"}>
                Send reset email
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
