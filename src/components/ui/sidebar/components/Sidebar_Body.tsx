"use client";
import UserInfo from "./userInfo";
import Btn_signOut from "../../../auth/btn_signOut";
import { useState } from "react";
import { ExtendendUser } from "../../../../app/types/next-auth";
import { FaCircleUser } from "react-icons/fa6";

interface Props {
  user?: ExtendendUser;
}

export default function Sidebar_Body({ user }: Props) {
  const [checked, setChecked] = useState(false);

  function handleClick() {
    setChecked(!checked);
  }
  return (
    <div className="drawer h-[100vh]">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={checked}
        onChange={handleClick}
      />
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
        <ul className="menu relative min-h-full w-80 items-center justify-between bg-gradient-to-r from-slate-900 to-slate-700 p-4 text-base-content">
          <button
            className="absolute right-0 top-2 pr-3 font-black text-black"
            onClick={handleClick}
          >
            X
          </button>
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
