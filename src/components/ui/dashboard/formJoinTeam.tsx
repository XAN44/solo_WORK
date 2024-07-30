"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { JoinTeam } from "../../../../schema/validateJoinTeam";
import { z } from "zod";
import { useEffect, useState, useTransition } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { MdError } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { ClipLoader } from "react-spinners";
import { JoinTeamAction, getTeams } from "../../../../action/create-joinTeam";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Button } from "../button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

type User = {
  id: string;
  username: string | null;
  email: string | null;
  emailVerified: Date | null;
  password: string | null;
  image: string | null;
  first_name: string | null;
  last_name: string | null;
};

type TeamMember = {
  user: User | null;
};

type Team = {
  id: string;
  department: string;
  project: string;
  member: TeamMember[];
};

export default function FormJoinTeam() {
  const form = useForm<z.infer<typeof JoinTeam>>({
    resolver: zodResolver(JoinTeam),
    defaultValues: {
      id: "",
    },
    mode: "onChange",
  });

  const [model, setModel] = useState<Team[]>([]);
  const [buttonText, setButtonText] = useState("Join Team");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getTeams();
      setModel(data);
    });
  }, []);

  const onSubmit = (value: z.infer<typeof JoinTeam>) => {
    startTransition(() => {
      JoinTeamAction(value).then((data) => {
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

  const supervisorsAvailable = model.some((team) =>
    team.member.some((member) => member.user !== null),
  );

  return (
    <>
      <div className="flex items-start justify-start">
        <h1 className="p-10 text-xl font-bold md:p-3">Team List</h1>
      </div>
      <div className="flex items-center justify-center p-3 text-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center space-y-8"
          >
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Supervisor</FormLabel>
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
                      {supervisorsAvailable ? (
                        model.flatMap((d) =>
                          d.member
                            .filter((f) => f.user !== null)
                            .map((member, i) => (
                              <SelectItem
                                key={member.user?.id}
                                value={member.user?.id || ""}
                              >
                                {member.user?.username}
                              </SelectItem>
                            )),
                        )
                      ) : (
                        <div className="p-4 text-red-500">
                          Waiting for admin to assign a supervisor.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select Supervisor</FormDescription>
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
