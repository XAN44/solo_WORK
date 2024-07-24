"use client";
import { Input } from "../../input";
import { FaCircleUser } from "react-icons/fa6";
import { Button } from "../../button";
import { ExtendendUser } from "../../../../app/types/next-auth";
import UserInfo from "./userInfo";
import Btn_signOut from "../../../auth/btn_signOut";

interface Props {
  user?: ExtendendUser;
}

export default function Sidebar_Body({ user }: Props) {
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content w-1">
        {/* Page content here */}
        <label
          htmlFor="my-drawer"
          className="drawer-button w-1 hover:cursor-pointer"
        >
          <FaCircleUser size={30} />
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu min-h-full w-80 items-center justify-between bg-gradient-to-b from-violet-600 to-indigo-600 p-4 text-base-content">
          <div className="">
            <UserInfo user={user} />
          </div>
          <div className="">
            <Btn_signOut />
          </div>
        </ul>
      </div>
    </div>
  );
}
