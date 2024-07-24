"use client";
import Image from "next/image";

import CardBar from "./components/cardBar";
import { usePathname } from "next/navigation";
import { AiOutlineUser } from "react-icons/ai";
import { cn } from "../../../lib/utils";
import clsx from "clsx";

interface Card_Content {
  bar_title: string;
  bar_content: string;
  bar_sub: string;
  href: string;
  color: string;
  bg2: string;
  bg1: string;
  children: React.ReactNode;
}
export default function Cardwarpper({
  bar_content,
  bar_title,
  bar_sub,
  color,
  href,
  bg1,
  bg2,
  children,
}: Card_Content) {
  const path = usePathname();
  return (
    <div className="hero relative flex min-h-screen w-screen items-center justify-center">
      <div className="hero-content flex">
        <div className="h-full w-full">
          <Image src="/bg.png" alt="" fill className="object-cover blur-sm" />
        </div>
        <div className="card absolute h-2/3 w-1/2 overflow-hidden bg-white">
          <div className="flex h-full">
            <div className="flex h-full w-1/2 flex-col items-center justify-center md:w-1/3">
              <div
                className={clsx(
                  "flex h-full w-full flex-col items-center justify-center",
                  bg1,
                )}
              >
                {path === "/auth/sign-up" && (
                  <>
                    <AiOutlineUser size={150} className={clsx(color)} />
                  </>
                )}
                <CardBar
                  color={color}
                  content={bar_content}
                  title={bar_title}
                  href={href}
                  subContent={bar_sub}
                />
              </div>
            </div>
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex h-full w-full">
                <div className={clsx("w-full", bg2)}>{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
