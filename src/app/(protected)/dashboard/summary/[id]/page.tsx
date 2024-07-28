import { auth } from "../../../../../../auth";
import { FetchAllTask, FetchTask } from "../../../../../../data/fetch-task";
import { getUserById } from "../../../../../../data/user";

export default async function page({ params }: { params: { id: string } }) {
  // TODO : ดึงข้อมูลผู้ใช้ที่เป็นหน้าโปรไฟล์
  const user = await getUserById(params.id);
  //   TODO : ดึงข้อมูลผู้ใช้ที่ได้เข้าสู่ระบบ
  const current = await auth();

  const task = await FetchAllTask(params.id);
  return (
    <div>
      {task.map((d) => (
        <>{d.title}</>
      ))}
    </div>
  );
}
