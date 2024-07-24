"use client";
// TODO: Form Sign-in
import React, { useState, useTransition } from "react";
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

export default function Form_LOGIN() {
  const [isPending, startTranstion] = useTransition();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (value: z.infer<typeof SignInSchema>) => {
    setError("");
    setSuccess("");
    startTranstion(() => {
      LoginAction(value).then((data) => {
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
              <Button type="submit" variant={"default"}>
                Login
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
