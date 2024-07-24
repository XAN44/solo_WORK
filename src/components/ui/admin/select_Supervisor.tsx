"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTeamSchema } from "../../../../schema/validateCreate_Team";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../input";
import { Textarea } from "../textarea";
import MultipleSelector, { Option } from "../multipleSelect";
import { Button } from "../button";

import { useEffect, useState, useTransition } from "react";
import { CreateTeamByAdmin } from "../../../../data/create-team";
import { DateTimePicker } from "../date-time-picker";

import { GetMember } from "../../../../data/fetch-member";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

import { AnimatePresence, motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { MdError, MdSend } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import toast from "react-hot-toast";
import { DepartMent } from "../../../lib/select";

export const SelectSuperVisor = () => {
  const form = useForm<z.infer<typeof createTeamSchema>>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      department: "",
      supervisor: "",
      project: "",
      member: [],
      report: "",
      startAt: undefined,
      endAt: undefined,
    },
    mode: "onChange",
  });

  const {
    watch,
    reset,
    setValue,
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  const [member, setMember] = useState<{ value: string; label: string }[]>([]);

  const [supervisor, setSupervisor] = useState<
    { value: string; label: string }[]
  >([]);

  const [isPending, startTransition] = useTransition();
  const selectedDepartment = watch("department");
  const selectedSupervisor = watch("supervisor");

  useEffect(() => {
    // * ถ้าเลือก department
    if (selectedDepartment) {
      reset({
        department: selectedDepartment,
      });
      // TODO : ส่งค่า department ไปที่ back-end
      startTransition(async () => {
        const options = await GetMember(selectedDepartment);
        // TODO : ยัดค่า options เข้าไปใส่ใน setSuper
        const setSuper = options.map((supervisor) => ({
          value: supervisor.id,
          label: supervisor.username || "",
        }));
        // * เก็บไว้ใน state
        setSupervisor(setSuper);
      });
    }
  }, [selectedDepartment, reset]);

  useEffect(() => {
    // *  ถ้าเลือก supervisor แล้ว
    if (selectedSupervisor) {
      // TODO : show member จากการ filter ผู้ใช้ที่ไม่ใช่ supervisor ใน field ก่อนหน้า (field supervisor)
      const showMember = supervisor.filter(
        (member) => member.value !== selectedSupervisor,
      );
      // * ยัดค่าเข้าไปเก็บใน state
      setMember(showMember);
      // * หากมีการเลือก supervisor ใหม่ จะทำการ reset member field
      setValue("member", []);
    }
  }, [selectedSupervisor, supervisor, setValue]);

  // TODO : ปุ่มกดสำหรับการ submit form
  const onSubmit = (value: z.infer<typeof createTeamSchema>) => {
    startTransition(() => {
      CreateTeamByAdmin(value).then((data) => {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-10">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select DepartMent</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DepartMent.map((d, index) => (
                      <SelectItem value={d.value} key={index}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  เลือกแผนกเพื่อแสดงรายชื่อพนักงานใน Field ถัดไป
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="supervisor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select supervisor</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="supervisor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {supervisor.map((d, i) => (
                      <SelectItem key={i} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  เลือกผู้ใช้ที่ต้องการแต่งตั้งให้กลายเป็นหัวหน้างาน
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="member"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member</FormLabel>
                <FormControl>
                  <MultipleSelector
                    {...field}
                    options={member}
                    placeholder="Select Member in team"
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        no results found.
                      </p>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="project"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Write project" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="report"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detail</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="write detail" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-x-6">
            <FormField
              control={form.control}
              name="startAt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="start work time"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endAt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="end work time"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* <FormSuccess message={success} />
          <FormError message={error} /> */}
        </div>
        <div className="mt-6 flex items-center justify-center">
          <Button type="submit" disabled={isPending}>
            {isPending ? <ClipLoader size={24} color="#ffffff" /> : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
