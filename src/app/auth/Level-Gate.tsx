"use client";
import { UserLevel } from "@prisma/client";
import { useCurrentLevel } from "../../../hooks/use-curret-user";

interface Level {
  children: React.ReactNode;
  allowedLevel: UserLevel;
}

function LevelGate({ children, allowedLevel }: Level) {
  const user = useCurrentLevel();

  console.log(user);

  const handleRefresh = () => {
    window.location.reload(); // ทำการรีเฟรชหน้าเว็บ
  };

  // ถ้าไม่มี user และ allowedLevel ตรงกัน ให้แสดง UI เริ่มทำงาน
  if (!user && allowedLevel === UserLevel.General) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4 rounded-md bg-gray-100 p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-700">เริ่มทำงาน</h1>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-blue-600 px-6 py-3 text-lg text-white shadow-md hover:bg-blue-800"
        >
          เริ่มทำงาน
        </button>
      </div>
    );
  }

  if (user !== allowedLevel) {
    return null;
  }

  return <div className="">{children}</div>;
}

export default LevelGate;
