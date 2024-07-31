"use client";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "../../../schema/validatSign";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import FormSuccess from "../ui/Form-success";
import FormError from "../ui/Form-Error";
import { Register_Action } from "../../../action/register";
import { DepartMent, Jobs, SelectLevel, SelectRole } from "../../lib/select";
import { UserLevel, UserRole } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { MdError } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { ClipLoader } from "react-spinners";

interface Props {
  currentStep: number;
  onSuccess: () => void;
  onError: () => void;
}

const Form_Register: React.FC<Props> = ({
  currentStep,
  onSuccess,
  onError,
}) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirmPassword: "",
      role: UserRole.Trainee,
      job: "",
      department: "",
      level: UserLevel.General,
    },
    mode: "onChange",
  });

  const {
    formState: { isDirty, isValid },
    watch,
  } = form;

  // TODO : ดูค่าที่มีการเปลี่ยนแปลงของ Field DepartMent
  const selectedDepartMent = watch("department");

  // TODO : สร้าง useState And generic type ดังนี้
  const [availableJobs, setAvailbaleJobs] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  // TODO : ใช้ UseEffect เมื่อ selectedDepartMent มีการเปลี่ยนแปลง
  useEffect(() => {
    if (selectedDepartMent) {
      // TODO : นำค่า selectedDepartMent ยัดเข้าไปใน key ของ jobs
      const jobs = Jobs[selectedDepartMent];
      setAvailbaleJobs(jobs || []);
    } else {
      setAvailbaleJobs([]);
    }
  }, [selectedDepartMent]);

  const stepsVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };
  const [buttonText, setButtonText] = useState("Sign-up");

  const onSubmit = (value: z.infer<typeof SignUpSchema>) => {
    startTransition(() => {
      Register_Action(value).then((data) => {
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
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex h-full w-full space-x-6">
              {currentStep === 0 && (
                <>
                  <motion.div
                    key="step0"
                    initial={stepsVariants.initial}
                    animate={stepsVariants.animate}
                    exit={stepsVariants.exit}
                    variants={stepsVariants}
                    transition={{ duration: 0.5 }}
                  >
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </>
              )}
              {currentStep === 1 && (
                <>
                  <motion.div
                    key="step1"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={stepsVariants}
                    transition={{ duration: 0.5 }}
                  >
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="example@gmail.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </>
              )}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={stepsVariants.initial}
                  animate={stepsVariants.animate}
                  exit={stepsVariants.exit}
                  variants={stepsVariants}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="*****"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="*****"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              )}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={stepsVariants.initial}
                  animate={stepsVariants.animate}
                  exit={stepsVariants.exit}
                  variants={stepsVariants}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col space-y-6">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SelectRole.map((d, index) => (
                                <div className="" key={index}>
                                  <SelectItem value={d.value}>
                                    {d.role}
                                  </SelectItem>
                                </div>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SelectLevel.map((d, index) => (
                                <SelectItem key={index} value={d.value}>
                                  {d.level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Department</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                              }}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Department" />
                              </SelectTrigger>
                              <SelectContent>
                                {DepartMent.map((d, index) => (
                                  <SelectItem key={index} value={d.value}>
                                    {d.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="job"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Job</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={availableJobs.length === 0}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Job" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableJobs.map((d, index) => (
                                  <SelectItem key={index} value={d.value}>
                                    {d.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              )}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={stepsVariants.initial}
                  animate={stepsVariants.animate}
                  exit={stepsVariants.exit}
                  variants={stepsVariants}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-lg font-bold text-white">
                        {success}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={stepsVariants.initial}
                  animate={stepsVariants.animate}
                  exit={stepsVariants.exit}
                  variants={stepsVariants}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-lg font-bold text-white">
                        {error}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            <div className="mt-10 flex flex-col">
              {currentStep === 3 ? (
                <Button
                  type="submit"
                  disabled={!isDirty || !isValid || isPending}
                >
                  {isPending ? (
                    <ClipLoader size={24} color="#ffffff" />
                  ) : (
                    buttonText
                  )}
                </Button>
              ) : null}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Form_Register;
