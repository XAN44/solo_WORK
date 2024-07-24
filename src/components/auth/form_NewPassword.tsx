"use client";
// TODO: Form Sign-in
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ResetPasswordSchema,
  ResetSchema,
  SignInSchema,
} from "../../../schema/validatSign";
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
import { useSearchParams } from "next/navigation";
import { newPassword } from "../../../action/newPassword-reset";

export default function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isPending, startTranstion] = useTransition();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (value: z.infer<typeof ResetPasswordSchema>) => {
    setError("");
    setSuccess("");
    startTranstion(() => {
      newPassword(value, token).then((data) => {
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isPending}
                        placeholder="*****"
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
                reset password
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
