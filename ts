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
import { User } from "@prisma/client";
import { FetchUserOptions } from "../../../lib/fetchMember/fetchMember";
import { UserInfo } from "../../../types/modal";
import { startTransition, useEffect, useState } from "react";
import { CreateTeamByAdmin } from "../../../../data/create-team";
import { DateTimePicker } from "../date-time-picker";
import { FetchDepartMent } from "../../../lib/fetchMember/fetchUserDepart";
import { DepartMent } from "../../../lib/select";
import { GetMember } from "../../../../data/fetch-member";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

interface UserInfos {
  users: UserInfo[];
}

export const SelectSuperVisor: React.FC<UserInfos> = ({ users }) => {
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
  });

  const { watch } = form;

  const [userOptions, setUserOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [supervisor, setSupervisor] = useState<
    { value: string; label: string }[]
  >([]);

  const selectedDepartment = watch("department");
  const selectedSupervisor = watch("supervisor");
  // TODO : แสดงผลรายชื่อของพนักงานตามแผนก
  useEffect(() => {
    // TODO : ถ้า Field department มีการเปลี่ยนแปลง
    if (selectedDepartment) {
      // TODO :  จะแสดงเนื้อหาที่ได้ filter ตามเนื้อหาด้านล่าง
      const filterUser = users.filter(
        (user) => user.department === selectedDepartment,
      );

      // TODO : ดึงข้อมูลผู้ใช้จาก database
      startTransition(async () => {
        const fetchedMembers = await GetMember(selectedDepartment);
        const memberOptions = fetchedMembers.map((user) => ({
          value: user.id,
          label: user.username || "unknow",
        }));

        // TODO : นำไปใช้
        setSupervisor(memberOptions);
        const memberSelected = fetchedMembers.map((user) => ({
          value: user.id,
          label: user.username || "unknow",
        }));
        setUserOptions(memberSelected);
      });
    }
  }, [selectedDepartment, users]);

  //TODO:  กรองสมาชิกไม่ให้แสดงผู้ที่ถูกเลือกเป็น supervisor
  useEffect(() => {
    if (selectedSupervisor) {
      const filteredMembers = supervisor.filter(
        (member) => member.value !== selectedSupervisor,
      );
      setUserOptions(filteredMembers);
    } else {
      setUserOptions(supervisor);
    }
  }, [selectedSupervisor, supervisor]);

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const onSubmit = (value: z.infer<typeof createTeamSchema>) => {
    startTransition(() => {
      CreateTeamByAdmin(value).then((data) => {
        setSuccess(data?.success);
        setError(data?.error);
      });
    });
  };

  return (
    <div className="h-full w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center justify-center space-y-10">
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
                      options={userOptions}
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
            <div className="text-destructive">{error}</div>
            <div className="text-emerald-500">{success}</div>
          </div>
          <div className="mt-6 flex items-center justify-center">
            <Button type="submit">Create </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
