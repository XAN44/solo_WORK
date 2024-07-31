"use client";
import { useQuery } from "@tanstack/react-query";
import { ExtendendUser } from "../../../../app/types/next-auth";
import { User } from "../../../../types/modalSumary";
import { getUserByIdBackUp } from "../../../../../data/user";

interface Props {
  user: User;
}

function UserInfo({ user }: Props) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["user", user.id],
    queryFn: () => getUserByIdBackUp(user.id),
  });

  if (error) {
  }

  if (data) {
  }

  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-full flex-col items-center justify-center space-y-5 text-center text-xl text-white">
        <h1 className="">Hello {data?.success?.username}</h1>
        <p>
          Role {data?.success?.job} {data?.success?.role}
        </p>
        <p>Level User : {data?.success?.level}</p>
      </div>
    </div>
  );
}

export default UserInfo;
