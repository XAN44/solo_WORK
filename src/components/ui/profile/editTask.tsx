"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { UpdateTaskSchema } from "../../../../schema/update_tasks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { UpdateTask } from "../../../../schema/edit_Task";
import { Button } from "../button";
import { Textarea } from "../textarea";
import { Input } from "../input";

interface EditTaskModalProps {
  taskId: string;
  title: string;
  descriptTion: string;
  onClose: () => void;
}

const EditTaskModal = ({
  taskId,
  descriptTion,
  title,
  onClose,
}: EditTaskModalProps) => {
  const form = useForm({
    resolver: zodResolver(UpdateTaskSchema),
    defaultValues: {
      title: title,
      description: descriptTion,
    },
  });

  const onSubmit = async (data: z.infer<typeof UpdateTaskSchema>) => {
    try {
      const response = await UpdateTask(taskId, data);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Task updated successfully");
        onClose();
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="rounded bg-white p-4 shadow-lg">
        <h2 className="text-xl font-bold">Edit Task</h2>
        <p className="text-sm">
          Please fill out the form below to update the task. All fields are
          required.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <Input {...field} defaultValue={title} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter your description"
                      className="w-64"
                      defaultValue={descriptTion}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4">
              <Button type="submit" className="bg-blue-500 text-white">
                {form.formState.isSubmitting ? (
                  <ClipLoader size={24} color="#ffffff" />
                ) : (
                  "Save"
                )}
              </Button>
              <Button onClick={onClose} className="ml-2 bg-gray-500 text-white">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditTaskModal;
